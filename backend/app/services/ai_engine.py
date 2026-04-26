"""Anthropic Claude wrapper for CV + cover letter generation.

Two execution modes selected via `settings.ai_parallel_split` :

* **Split + parallel (default)** — runs two `client.messages.stream()` in
  parallel via `asyncio.gather()` :
    - one for the CV body only (~1700 tokens output)
    - one for the cover letter only (~600 tokens output)
  Wall time = max(cv, letter) ≈ 50 % of the single-call baseline.
  Costs +1 cache write per generation (~+0.5 ¢) but margin stays > 85 %.

* **Single call (fallback)** — keeps the original behaviour where Claude
  returns the full JSON (CV fields + lettre_motivation) in one shot.
  Used as escape hatch if we ever observe coherence issues between the
  two parallel outputs.

Streaming is always on (`client.messages.stream(...)`) so we can pipe
progress events to the SSE bus and keep wall-time-equivalent latency.
"""

from __future__ import annotations

import asyncio
import json
import logging
from dataclasses import dataclass
from typing import Awaitable, Callable

import anthropic

from app.config import settings

logger = logging.getLogger(__name__)


@dataclass
class UsageStats:
    input_tokens: int
    output_tokens: int

    @property
    def total_tokens(self) -> int:
        return self.input_tokens + self.output_tokens

    @property
    def estimated_cost(self) -> float:
        # Sonnet 4.6 (default) : ~3 $/MTok input, ~15 $/MTok output.
        # Haiku 4.5 fallback : ~1 $/MTok input, ~5 $/MTok output.
        # We use Sonnet rates for the estimate when the configured model
        # name contains "sonnet", else assume Haiku-class rates.
        if "sonnet" in (settings.claude_model or "").lower():
            return (
                self.input_tokens * 3 / 1_000_000
                + self.output_tokens * 15 / 1_000_000
            )
        return (
            self.input_tokens * 1 / 1_000_000
            + self.output_tokens * 5 / 1_000_000
        )

    def merged_with(self, other: "UsageStats") -> "UsageStats":
        return UsageStats(
            input_tokens=self.input_tokens + other.input_tokens,
            output_tokens=self.output_tokens + other.output_tokens,
        )


# ---------------------------------------------------------------------------
# Prompt blocks
# ---------------------------------------------------------------------------
def _build_system_prompt(gender: str = "male") -> str:
    gender_rule = (
        'Le candidat est un HOMME. Utilise TOUJOURS la forme masculine (ex: "Chargé" et non "Chargé(e)", "Directeur" et non "Directeur/trice"). Jamais de forme inclusive ou féminine.'
        if gender == "male"
        else 'La candidate est une FEMME. Utilise TOUJOURS la forme féminine (ex: "Chargée" et non "Chargé(e)", "Directrice" et non "Directeur/trice"). Jamais de forme inclusive ou masculine.'
    )

    return f"""Tu es un expert en rédaction de CV et lettres de motivation en français, spécialisé dans l'optimisation ATS (Applicant Tracking System).
Tu adaptes le profil d'un candidat pour correspondre au mieux à une offre d'emploi.

TON OBJECTIF PRINCIPAL : maximiser la correspondance entre le CV et l'offre d'emploi.
Pour cela, tu dois :
- IDENTIFIER les mots-clés, compétences et responsabilités clés de l'offre
- RÉUTILISER ces mots-clés EXACTEMENT dans le CV (résumé, bullets, compétences)
- REFORMULER chaque bullet d'expérience pour créer un lien direct avec les exigences de l'offre
- QUANTIFIER quand c'est possible (chiffres, pourcentages, volumes)

Tu dois rester crédible — tu peux reformuler librement, réordonner, enrichir et ajouter
des compétences proches de celles existantes, mais jamais de compétences totalement
déconnectées du profil.

RÈGLE D'OR SUR LES CHIFFRES : n'invente JAMAIS de chiffres absolus (CA, montants en euros,
effectifs managés, nombre de clients, volumes). N'utilise QUE les chiffres présents dans le
profil original du candidat. Si aucun chiffre n'est fourni pour une expérience, reste
qualitatif — il vaut mieux une bullet sans chiffre qu'une bullet avec un chiffre inventé.
Les seules quantifications acceptables sans source sont des ordres de grandeur très modestes
et plausibles pour le contexte (ex: "équipe pluridisciplinaire", "portefeuille clients BtoB"
sans montant chiffré).

{gender_rule}

FORMAT DE RÉPONSE STRICT : tu réponds UNIQUEMENT avec un JSON brut.
- Le 1er caractère de ta réponse DOIT être '{{' et le dernier '}}'.
- AUCUNE balise markdown ```json ou ```. AUCUN texte avant ou après le JSON.
- AUCUN commentaire, AUCUNE explication."""


# ---------------------------------------------------------------------------
# Profile block — shared between single-call and split modes.
# ---------------------------------------------------------------------------
def _profile_block(profile_data: dict, custom_instructions: str | None) -> str:
    exp_text = ""
    for exp in profile_data.get("experiences", []):
        exp_text += f"\n- {exp['title']} @ {exp['company']} ({exp.get('dates', '')})\n"
        for b in exp.get("bullets", []):
            exp_text += f"  • {b}\n"

    edu_text = "\n".join(
        f"- {e['title']} / {e['school']} ({e.get('dates', '')})"
        for e in profile_data.get("education", [])
    )

    custom_rules = ""
    if custom_instructions:
        custom_rules = f"""

INSTRUCTIONS SPÉCIFIQUES DU CANDIDAT :
{custom_instructions}
"""

    return f"""Voici le profil du candidat :

Nom : {profile_data["full_name"]}

Formation :
{edu_text}

Expériences professionnelles :
{exp_text}

Compétences : {", ".join(profile_data.get("skills", []))}
Atouts : {", ".join(profile_data.get("soft_skills", []))}
Langues : {", ".join(profile_data.get("languages", []))}
{custom_rules}---"""


# Schema + rules for the SINGLE-CALL mode (full CV + lettre).
def _build_profile_and_format(
    profile_data: dict, custom_instructions: str | None = None
) -> str:
    return f"""{_profile_block(profile_data, custom_instructions)}

Tu vas générer un JSON avec cette structure EXACTE, en appliquant les règles ci-dessous à l'offre d'emploi fournie plus bas :

{{
  "nom_entreprise": "Le nom de l'entreprise qui recrute (tel qu'il apparaît dans l'offre)",
  "titre_poste": "Le titre EXACT du poste tel qu'il apparaît dans l'offre d'emploi",
  "resume_professionnel": "3-4 LIGNES COURTES maximum (environ 40-50 mots). Accroche percutante : poste visé + 2-3 compétences clés de l'offre + lien avec le parcours.",
  "competences": ["compétence 1", "compétence 2", "..."],
  "atouts": ["atout 1", "atout 2", "..."],
  "experiences": [
    {{"title": "Titre", "company": "Entreprise", "location": "Lieu", "dates": "dates", "bullets": ["point 1", "point 2"]}}
  ],
  "lettre_motivation": "Texte complet de la lettre de motivation..."
}}

RÈGLES IMPÉRATIVES :
1. Identifie les 5-10 mots-clés de l'offre. Chacun DOIT apparaître au moins une fois dans le CV.
2. titre_poste = titre exact de l'offre.
3. resume_professionnel = 40-50 mots, poste visé + 2-3 compétences clés + lien parcours.
4. Les title des expériences restent EXACTEMENT identiques au profil original — JAMAIS modifiés.
5. Chaque bullet est réécrite avec le vocabulaire EXACT de l'offre. Étoffe les bullets courtes en détaillant missions/méthodes (pas de chiffres inventés).
6. N'INVENTE JAMAIS de chiffres absolus (CA, montants €, effectifs, ROAS). Reprends uniquement ceux du profil.
7. Ordonne expériences et compétences par pertinence pour l'offre (récente d'abord).
8. Compétences : reprends celles du profil qui matchent l'offre, reformule avec le vocab de l'offre. N'ajoute des compétences de l'offre QUE si crédibles au vu du parcours ET au cœur du métier visé. Ne liste PAS les compétences décrivant l'environnement (ex: "cybersécurité" pour un poste commercial).
9. Atouts : adapte aux qualités recherchées dans l'offre.
10. lettre_motivation : structure Vous (entreprise) / Moi (parcours avec mots-clés offre) / Nous (collab). 250-350 mots. Sépare les paragraphes avec \\n\\n.
11. Maximum 6 expériences (3-4 bullets détaillées chacune), 12 compétences, 6 atouts.
12. Conserve TOUTES les expériences du profil, ne supprime rien."""


# Schema + rules for the CV-ONLY parallel call.
def _build_profile_and_format_cv_only(
    profile_data: dict, custom_instructions: str | None = None
) -> str:
    return f"""{_profile_block(profile_data, custom_instructions)}

Tu vas générer un JSON avec cette structure EXACTE pour ADAPTER LE CV à l'offre d'emploi fournie plus bas. Tu ne génères PAS la lettre de motivation ici, uniquement le CV :

{{
  "nom_entreprise": "Le nom de l'entreprise qui recrute (tel qu'il apparaît dans l'offre)",
  "titre_poste": "Le titre EXACT du poste tel qu'il apparaît dans l'offre",
  "resume_professionnel": "3-4 LIGNES COURTES (40-50 mots). Accroche : poste visé + 2-3 compétences clés + lien parcours.",
  "competences": ["compétence 1", "compétence 2", "..."],
  "atouts": ["atout 1", "atout 2", "..."],
  "experiences": [
    {{"title": "Titre", "company": "Entreprise", "location": "Lieu", "dates": "dates", "bullets": ["point 1", "point 2"]}}
  ]
}}

RÈGLES IMPÉRATIVES :
1. Identifie les 5-10 mots-clés de l'offre. Chacun DOIT apparaître au moins une fois dans le CV.
2. titre_poste = titre exact de l'offre.
3. resume_professionnel = 40-50 mots, poste visé + 2-3 compétences clés + lien parcours.
4. Les title des expériences restent EXACTEMENT identiques au profil original — JAMAIS modifiés.
5. Chaque bullet est réécrite avec le vocabulaire EXACT de l'offre. Étoffe les bullets courtes en détaillant missions/méthodes (pas de chiffres inventés).
6. N'INVENTE JAMAIS de chiffres absolus (CA, montants €, effectifs, ROAS). Reprends uniquement ceux du profil.
7. Ordonne expériences et compétences par pertinence pour l'offre (récente d'abord).
8. Compétences : celles du profil qui matchent l'offre, reformulées avec le vocab de l'offre. N'ajoute de l'offre QUE si crédible + cœur de métier. Pas de compétences décrivant juste l'environnement.
9. Atouts : adapte aux qualités recherchées.
10. Maximum 6 expériences (3-4 bullets), 12 compétences, 6 atouts. Conserve TOUTES les expériences du profil."""


# Schema + rules for the LETTER-ONLY parallel call.
def _build_profile_and_format_letter_only(
    profile_data: dict, custom_instructions: str | None = None
) -> str:
    return f"""{_profile_block(profile_data, custom_instructions)}

Tu vas rédiger UNIQUEMENT la lettre de motivation pour l'offre d'emploi fournie plus bas. Tu ne génères PAS le CV ici. Format :

{{
  "nom_entreprise": "Le nom de l'entreprise qui recrute (tel qu'il apparaît dans l'offre)",
  "titre_poste": "Le titre EXACT du poste tel qu'il apparaît dans l'offre",
  "lettre_motivation": "Texte complet de la lettre, paragraphes séparés par \\n\\n"
}}

RÈGLES IMPÉRATIVES POUR LA LETTRE :
1. Structure Vous / Moi / Nous :
   - VOUS : ce que l'entreprise fait/recherche, montre que tu as LU l'offre en détail
   - MOI : ce que je peux apporter, exemples CONCRETS du parcours, mots-clés de l'offre
   - NOUS : ce qu'on pourrait accomplir ensemble
2. Longueur : 250-350 mots. Paragraphes séparés par \\n\\n.
3. Cite 2-3 expériences ou réalisations RÉELLES du profil (pas inventées).
4. Réutilise 3-5 mots-clés EXACTS de l'offre.
5. Ton professionnel mais pas guindé. Évite les formules creuses ("dynamique et motivé").
6. nom_entreprise + titre_poste reprennent l'offre à l'identique."""


def _build_job_section(job_text: str) -> str:
    return f"""---

OFFRE D'EMPLOI À ADAPTER :

{job_text}

---

Génère maintenant le JSON."""


# ---------------------------------------------------------------------------
# Streaming Claude call — shared by both modes.
# ---------------------------------------------------------------------------
async def _stream_claude(
    system_prompt: str,
    cached_block: str,
    dynamic_block: str,
    max_tokens: int,
    on_text: Callable[[str], Awaitable[None] | None] | None = None,
) -> tuple[str, UsageStats]:
    """Run a single streaming Claude call, returning (text, usage).

    Streams tokens to `on_text` if provided (lets the caller forward chunks
    to an SSE bus). The function still waits for the full message before
    returning — wall time is unchanged but the streaming hook lets us push
    progress to the user without blocking.
    """
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    async with client.messages.stream(
        model=settings.claude_model,
        max_tokens=max_tokens,
        system=[
            {
                "type": "text",
                "text": system_prompt,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": cached_block,
                        "cache_control": {"type": "ephemeral"},
                    },
                    {"type": "text", "text": dynamic_block},
                ],
            }
        ],
    ) as stream:
        chunks: list[str] = []
        async for text in stream.text_stream:
            chunks.append(text)
            if on_text is not None:
                result = on_text(text)
                if asyncio.iscoroutine(result):
                    await result
        final = await stream.get_final_message()

    full_text = "".join(chunks).strip()
    if full_text.startswith("```"):
        full_text = full_text.split("\n", 1)[1] if "\n" in full_text else full_text
        full_text = full_text.rsplit("```", 1)[0].strip()

    usage = UsageStats(
        input_tokens=final.usage.input_tokens,
        output_tokens=final.usage.output_tokens,
    )
    cache_read = getattr(final.usage, "cache_read_input_tokens", 0) or 0
    cache_write = getattr(final.usage, "cache_creation_input_tokens", 0) or 0
    if cache_read or cache_write:
        logger.info(
            "Prompt cache — read: %s tokens, write: %s tokens",
            cache_read,
            cache_write,
        )
    return full_text, usage


def _parse_json_with_keys(text: str, required: list[str]) -> dict:
    data = json.loads(text)
    missing = [k for k in required if k not in data]
    if missing:
        raise ValueError(f"Clés manquantes : {missing}")
    return data


# ---------------------------------------------------------------------------
# Single-call mode (fallback).
# ---------------------------------------------------------------------------
async def _generate_unified(
    job_text: str,
    profile_data: dict,
    custom_instructions: str | None,
    gender: str,
) -> tuple[dict, UsageStats]:
    system_prompt = _build_system_prompt(gender)
    cached_block = _build_profile_and_format(profile_data, custom_instructions)
    dynamic_block = _build_job_section(job_text)
    required = [
        "nom_entreprise",
        "titre_poste",
        "resume_professionnel",
        "competences",
        "atouts",
        "experiences",
        "lettre_motivation",
    ]

    for attempt in range(2):
        retry_suffix = (
            "\n\nTA RÉPONSE PRÉCÉDENTE N'ÉTAIT PAS DU JSON VALIDE. Réponds UNIQUEMENT avec du JSON valide, sans markdown."
            if attempt > 0
            else ""
        )
        text, usage = await _stream_claude(
            system_prompt=system_prompt,
            cached_block=cached_block,
            dynamic_block=dynamic_block + retry_suffix,
            max_tokens=settings.max_tokens + 1000,  # full JSON needs more
        )
        try:
            return _parse_json_with_keys(text, required), usage
        except (json.JSONDecodeError, ValueError) as exc:
            if attempt == 0:
                logger.warning("Invalid unified response (%s), retrying...", exc)
                continue
            raise RuntimeError(
                "Impossible d'obtenir une réponse JSON valide après 2 tentatives."
            ) from exc

    raise RuntimeError("Échec de la génération.")


# ---------------------------------------------------------------------------
# Split + parallel mode (default).
# ---------------------------------------------------------------------------
async def _generate_cv_only(
    job_text: str,
    profile_data: dict,
    custom_instructions: str | None,
    gender: str,
) -> tuple[dict, UsageStats]:
    system_prompt = _build_system_prompt(gender)
    cached_block = _build_profile_and_format_cv_only(
        profile_data, custom_instructions
    )
    dynamic_block = _build_job_section(job_text)
    required = [
        "nom_entreprise",
        "titre_poste",
        "resume_professionnel",
        "competences",
        "atouts",
        "experiences",
    ]

    for attempt in range(2):
        retry_suffix = (
            "\n\nRappel : JSON brut uniquement, sans markdown."
            if attempt > 0
            else ""
        )
        text, usage = await _stream_claude(
            system_prompt=system_prompt,
            cached_block=cached_block,
            dynamic_block=dynamic_block + retry_suffix,
            max_tokens=settings.max_tokens,
        )
        try:
            return _parse_json_with_keys(text, required), usage
        except (json.JSONDecodeError, ValueError) as exc:
            if attempt == 0:
                logger.warning("Invalid CV-only response (%s), retrying...", exc)
                continue
            raise RuntimeError(
                "Impossible d'obtenir un CV en JSON valide après 2 tentatives."
            ) from exc

    raise RuntimeError("Échec de la génération CV.")


async def _generate_letter_only(
    job_text: str,
    profile_data: dict,
    custom_instructions: str | None,
    gender: str,
) -> tuple[dict, UsageStats]:
    system_prompt = _build_system_prompt(gender)
    cached_block = _build_profile_and_format_letter_only(
        profile_data, custom_instructions
    )
    dynamic_block = _build_job_section(job_text)
    required = ["lettre_motivation", "nom_entreprise", "titre_poste"]

    for attempt in range(2):
        retry_suffix = (
            "\n\nRappel : JSON brut uniquement, sans markdown."
            if attempt > 0
            else ""
        )
        # Letter is much shorter (~600 tokens output).
        text, usage = await _stream_claude(
            system_prompt=system_prompt,
            cached_block=cached_block,
            dynamic_block=dynamic_block + retry_suffix,
            max_tokens=1000,
        )
        try:
            return _parse_json_with_keys(text, required), usage
        except (json.JSONDecodeError, ValueError) as exc:
            if attempt == 0:
                logger.warning("Invalid letter response (%s), retrying...", exc)
                continue
            raise RuntimeError(
                "Impossible d'obtenir une lettre en JSON valide après 2 tentatives."
            ) from exc

    raise RuntimeError("Échec de la génération de la lettre.")


# ---------------------------------------------------------------------------
# Public entry point used by the pipeline.
# ---------------------------------------------------------------------------
async def generate_adapted_cv(
    job_text: str,
    profile_data: dict,
    custom_instructions: str | None = None,
    gender: str = "male",
) -> tuple[dict, UsageStats]:
    """Generate a fully adapted CV + cover letter.

    Dispatches to the parallel split or the unified single-call path based
    on `settings.ai_parallel_split`. Returns (data, usage) where `data`
    contains all the keys the pipeline expects (nom_entreprise, titre_poste,
    resume_professionnel, competences, atouts, experiences, lettre_motivation).
    """
    if not settings.ai_parallel_split:
        return await _generate_unified(
            job_text, profile_data, custom_instructions, gender
        )

    cv_task = _generate_cv_only(job_text, profile_data, custom_instructions, gender)
    letter_task = _generate_letter_only(
        job_text, profile_data, custom_instructions, gender
    )
    (cv_data, cv_usage), (letter_data, letter_usage) = await asyncio.gather(
        cv_task, letter_task
    )

    # Merge: the CV call is authoritative for nom_entreprise / titre_poste
    # (the two answers should agree, but we don't risk a mismatch). The
    # letter call only contributes its `lettre_motivation` text.
    merged = {**cv_data, "lettre_motivation": letter_data["lettre_motivation"]}
    return merged, cv_usage.merged_with(letter_usage)
