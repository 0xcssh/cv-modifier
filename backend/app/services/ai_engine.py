import json
import logging
from dataclasses import dataclass

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
        # Haiku 4.5 pricing (approx) — $1/M input, $5/M output
        return (self.input_tokens * 1 / 1_000_000) + (
            self.output_tokens * 5 / 1_000_000
        )


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

Tu réponds UNIQUEMENT en JSON valide. Pas de markdown, pas de commentaires, pas de texte autour."""


def _build_profile_and_format(
    profile_data: dict,
    custom_instructions: str | None = None,
) -> str:
    """Static/cacheable part of the user prompt: profile + custom instructions + output format + rules.

    This string is stable for a given user (profile + custom instructions rarely change),
    so it's marked with cache_control in the API call to benefit from Anthropic prompt caching.
    """
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
{custom_rules}
---

Tu vas générer un JSON avec cette structure EXACTE, en appliquant les règles ci-dessous à l'offre d'emploi fournie plus bas :

{{
  "nom_entreprise": "Le nom de l'entreprise qui recrute (tel qu'il apparaît dans l'offre)",
  "titre_poste": "Le titre EXACT du poste tel qu'il apparaît dans l'offre d'emploi",
  "resume_professionnel": "3-4 LIGNES COURTES maximum (environ 40-50 mots). Accroche percutante et directe : poste visé + 2-3 compétences clés de l'offre + lien avec le parcours. PAS de phrases longues ou de pavé de texte.",
  "competences": ["compétence 1", "compétence 2", "..."],
  "atouts": ["atout 1", "atout 2", "..."],
  "experiences": [
    {{
      "title": "Titre du poste",
      "company": "Entreprise",
      "location": "Lieu",
      "dates": "dates",
      "bullets": ["point 1", "point 2", "point 3"]
    }}
  ],
  "lettre_motivation": "Texte complet de la lettre de motivation..."
}}

RÈGLES IMPÉRATIVES :

== ADAPTATION MAXIMALE ==
0. AVANT DE RÉDIGER, liste mentalement les 5-10 mots-clés et compétences les plus importants de l'offre. Chacun de ces mots-clés DOIT apparaître au moins une fois dans le CV (résumé, compétences ou bullets).

1. LE TITRE (titre_poste) DOIT être le titre du poste de l'offre d'emploi, PAS un titre générique.

2. LE RÉSUMÉ (resume_professionnel) DOIT :
   - Faire 3-4 LIGNES COURTES maximum (40-50 mots). C'est une ACCROCHE, pas un paragraphe.
   - Mentionner le poste visé + 2-3 compétences clés de l'offre
   - Montrer le lien direct entre le parcours et le poste
   - Phrases courtes et percutantes, pas de longues envolées

3. TITRES DE POSTE : les titres (title) de TOUTES les expériences doivent rester EXACTEMENT identiques au profil original. Ne les modifie JAMAIS.

4. TOUTES les expériences DOIVENT être reformulées activement pour coller à l'offre :
   - Chaque BULLET doit être réécrite pour créer un lien avec l'offre. Utilise le vocabulaire EXACT de l'offre.
   - Étoffe les bullets courtes en détaillant les MISSIONS, MÉTHODES et RESPONSABILITÉS (pas en inventant des chiffres).
   - N'INVENTE JAMAIS de chiffres absolus (CA, montants €, effectifs, nombre de clients, ROAS, taux de conversion). Reprends uniquement ceux du profil original.
   - Si le profil contient un chiffre, tu peux le reprendre tel quel. Sinon, reste qualitatif.
   - Règle d'or : chaque bullet doit contenir au moins un mot-clé de l'offre.

5. ORDONNE les expériences et compétences par pertinence pour l'offre (la plus récente en premier).

6. COMPÉTENCES : sélection rigoureuse et cohérente avec le RÔLE visé.
   - PRIORITÉ 1 : reprends d'abord les compétences du profil original qui matchent l'offre, en les reformulant avec le vocabulaire EXACT de l'offre si besoin (ex: "Vente BtoB" → "Développement commercial BtoB" si l'offre le formule ainsi).
   - PRIORITÉ 2 : ajoute des compétences de l'offre UNIQUEMENT si elles correspondent au CŒUR DE MÉTIER du poste visé ET sont crédibles au vu du parcours.
   - FILTRE par fonction : pour un poste commercial/business, privilégie les compétences commerciales (prospection, négociation, cycle de vente, CRM, gestion de portefeuille, closing, account management). Ne liste PAS de compétences techniques profondes (cybersécurité, cloud, infrastructure, développement) même si elles apparaissent dans l'offre — elles décrivent l'environnement du poste, pas les compétences attendues du candidat. Inversement pour un poste technique, évite les compétences purement commerciales.
   - Test de cohérence : avant d'ajouter une compétence, demande-toi "est-ce que cette compétence est attendue de MOI dans ce poste, ou décrit-elle juste le secteur/produit ?". Si c'est le secteur, ne l'ajoute pas aux compétences (mais tu peux la mentionner dans un bullet d'expérience ou le résumé comme connaissance de l'écosystème).

7. ATOUTS : adapte les atouts aux qualités recherchées dans l'offre.

8. La lettre de motivation suit la structure Vous/Moi/Nous :
   - Vous : ce que l'entreprise fait/recherche (montre que tu as LU l'offre en détail)
   - Moi : ce que je peux apporter (cite des exemples CONCRETS du parcours, avec les mots-clés de l'offre)
   - Nous : ce qu'on pourrait accomplir ensemble
   La lettre doit faire environ 250-350 mots. Utilise des \\n\\n pour séparer les paragraphes.

9. Maximum 6 expériences. Chaque expérience a 3-4 bullets DÉTAILLÉES (pas de bullets d'un seul mot).
10. Maximum 12 compétences, maximum 6 atouts.
11. Conserve TOUTES les expériences du profil, ne supprime rien.
12. Réponds UNIQUEMENT avec le JSON, rien d'autre."""


def _build_job_section(job_text: str) -> str:
    """Dynamic part of the user prompt: the job offer. Varies per generation."""
    return f"""---

OFFRE D'EMPLOI À ADAPTER :

{job_text}

---

Génère maintenant le JSON."""


async def generate_adapted_cv(
    job_text: str,
    profile_data: dict,
    custom_instructions: str | None = None,
    gender: str = "male",
) -> tuple[dict, UsageStats]:
    """Generate an adapted CV using Claude API with prompt caching.

    The system prompt and the profile+rules block are cached (ephemeral, ~5min TTL)
    so subsequent generations for the same user within that window benefit from
    reduced latency and cost on those static sections.

    Returns (adapted_data, usage_stats).
    """
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    system_prompt = _build_system_prompt(gender)
    cached_content = _build_profile_and_format(profile_data, custom_instructions)
    dynamic_content = _build_job_section(job_text)

    for attempt in range(2):
        try:
            messages_content = [
                {
                    "type": "text",
                    "text": cached_content,
                    "cache_control": {"type": "ephemeral"},
                },
                {
                    "type": "text",
                    "text": (
                        dynamic_content
                        if attempt == 0
                        else dynamic_content
                        + "\n\nTA RÉPONSE PRÉCÉDENTE N'ÉTAIT PAS DU JSON VALIDE. Réponds UNIQUEMENT avec du JSON valide."
                    ),
                },
            ]

            response = await client.messages.create(
                model=settings.claude_model,
                max_tokens=settings.max_tokens,
                system=[
                    {
                        "type": "text",
                        "text": system_prompt,
                        "cache_control": {"type": "ephemeral"},
                    }
                ],
                messages=[{"role": "user", "content": messages_content}],
            )
            content = response.content[0].text.strip()

            # Remove markdown fences if present
            if content.startswith("```"):
                content = content.split("\n", 1)[1]
                content = content.rsplit("```", 1)[0]

            data = json.loads(content)

            # Validate required keys
            required = [
                "nom_entreprise",
                "titre_poste",
                "resume_professionnel",
                "competences",
                "atouts",
                "experiences",
                "lettre_motivation",
            ]
            missing = [k for k in required if k not in data]
            if missing:
                raise ValueError(f"Clés manquantes : {missing}")

            usage = UsageStats(
                input_tokens=response.usage.input_tokens,
                output_tokens=response.usage.output_tokens,
            )
            cache_read = getattr(response.usage, "cache_read_input_tokens", 0) or 0
            cache_write = getattr(response.usage, "cache_creation_input_tokens", 0) or 0
            if cache_read or cache_write:
                logger.info(
                    f"Prompt cache — read: {cache_read} tokens, write: {cache_write} tokens"
                )
            return data, usage

        except json.JSONDecodeError:
            if attempt == 0:
                logger.warning("Invalid JSON response, retrying...")
            else:
                raise RuntimeError(
                    "Impossible d'obtenir une réponse JSON valide après 2 tentatives."
                )
        except ValueError as e:
            if attempt == 0:
                logger.warning(f"{e}, retrying...")
            else:
                raise

    raise RuntimeError("Échec de la génération.")
