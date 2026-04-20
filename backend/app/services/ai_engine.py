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
        # Sonnet 4 pricing (approx)
        return (self.input_tokens * 3 / 1_000_000) + (
            self.output_tokens * 15 / 1_000_000
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

{gender_rule}

Tu réponds UNIQUEMENT en JSON valide. Pas de markdown, pas de commentaires, pas de texte autour."""


def _build_user_prompt(
    job_text: str,
    profile_data: dict,
    custom_instructions: str | None = None,
) -> str:
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

Voici l'offre d'emploi :

{job_text}

---

Génère un JSON avec cette structure EXACTE :
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
   - AJOUTE des détails crédibles et réalistes pour étoffer les bullets courtes.
   - QUANTIFIE autant que possible avec des chiffres crédibles (budgets, pourcentages, volumes).
   - Règle d'or : chaque bullet doit contenir au moins un mot-clé de l'offre.

5. ORDONNE les expériences et compétences par pertinence pour l'offre (la plus récente en premier).

6. COMPÉTENCES : ajoute toutes les compétences mentionnées dans l'offre qui sont crédibles pour le profil.

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


async def generate_adapted_cv(
    job_text: str,
    profile_data: dict,
    custom_instructions: str | None = None,
    gender: str = "male",
) -> tuple[dict, UsageStats]:
    """Generate an adapted CV using Claude API. Returns (adapted_data, usage_stats)."""
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    system_prompt = _build_system_prompt(gender)
    user_prompt = _build_user_prompt(job_text, profile_data, custom_instructions)

    for attempt in range(2):
        try:
            response = await client.messages.create(
                model=settings.claude_model,
                max_tokens=settings.max_tokens,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
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
            return data, usage

        except json.JSONDecodeError:
            if attempt == 0:
                logger.warning("Invalid JSON response, retrying...")
                user_prompt += "\n\nTA RÉPONSE PRÉCÉDENTE N'ÉTAIT PAS DU JSON VALIDE. Réponds UNIQUEMENT avec du JSON valide."
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
