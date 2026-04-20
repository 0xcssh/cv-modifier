import json
import anthropic
from config import ANTHROPIC_API_KEY, CLAUDE_MODEL, MAX_TOKENS

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """Tu es un expert en rédaction de CV et lettres de motivation en français, spécialisé dans l'optimisation ATS (Applicant Tracking System).
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

Le candidat est un HOMME. Utilise TOUJOURS la forme masculine (ex: "Chargé" et non "Chargé(e)", "Directeur" et non "Directeur/trice"). Jamais de forme inclusive ou féminine.

Tu réponds UNIQUEMENT en JSON valide. Pas de markdown, pas de commentaires, pas de texte autour."""


def _build_user_prompt(job_text: str, profile: dict) -> str:
    # Serialize profile for the prompt
    exp_text = ""
    for exp in profile["experiences"]:
        exp_text += f"\n- {exp['title']} @ {exp['company']} ({exp['dates']})\n"
        for b in exp["bullets"]:
            exp_text += f"  • {b}\n"

    edu_text = "\n".join(
        f"- {e['title']} / {e['school']} ({e['dates']})" for e in profile["education"]
    )

    return f"""Voici le profil du candidat :

Nom : {profile["name"]}

Formation :
{edu_text}

Expériences professionnelles :
{exp_text}

Compétences : {", ".join(profile["skills"])}
Atouts : {", ".join(profile["soft_skills"])}
Langues : {", ".join(profile["languages"])}

---

Voici l'offre d'emploi :

{job_text}

---

Génère un JSON avec cette structure EXACTE :
{{
  "nom_entreprise": "Le nom de l'entreprise qui recrute (tel qu'il apparaît dans l'offre)",
  "titre_poste": "Le titre EXACT du poste tel qu'il apparaît dans l'offre d'emploi (ex: Chef de Projet Digital, Responsable Marketing, etc.)",
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
   - AJOUTE des détails crédibles et réalistes pour étoffer les bullets courtes. Par exemple, "E-mail marketing" peut devenir "Conception et déploiement de campagnes e-mail marketing (taux d'ouverture +25%), segmentation des bases de données prospects".
   - QUANTIFIE autant que possible avec des chiffres crédibles (budgets, pourcentages, volumes).
   - Règle d'or : chaque bullet doit contenir au moins un mot-clé de l'offre.
   - NOTE sur AY CLEAN : c'est une société de nettoyage de véhicules. Les bullets doivent rester sur les aspects gestion (RH, management, relation client, facturation, prospection) mais reformulées avec le vocabulaire de l'offre. Ne dis pas que c'est "technique" ou "industriel". Dans la lettre de motivation, mentionne-le brièvement comme expérience entrepreneuriale.

5. ORDONNE les expériences et compétences par pertinence pour l'offre (les plus pertinentes en premier). L'expérience AY CLEAN reste en premier car c'est la plus récente.

6. COMPÉTENCES : ajoute toutes les compétences mentionnées dans l'offre qui sont crédibles pour le profil (outils, méthodes, concepts). Ne te limite pas à la liste existante — si l'offre demande "Trello" et le candidat utilise des outils de gestion de projet, ajoute-le.

7. ATOUTS : adapte les atouts aux qualités recherchées dans l'offre. Si l'offre cherche "esprit d'équipe", remplace un atout moins pertinent par celui-ci.

8. La lettre de motivation suit la structure Vous/Moi/Nous :
   - Vous : ce que l'entreprise fait/recherche (montre que tu as LU l'offre en détail)
   - Moi : ce que je peux apporter (cite des exemples CONCRETS du parcours, avec les mots-clés de l'offre)
   - Nous : ce qu'on pourrait accomplir ensemble
   La lettre doit faire environ 250-350 mots. Utilise des \\n\\n pour séparer les paragraphes.

9. Maximum 6 expériences. Chaque expérience a 3-4 bullets DÉTAILLÉES (pas de bullets d'un seul mot).
10. Maximum 12 compétences, maximum 6 atouts.
11. Conserve TOUTES les expériences du profil, ne supprime rien.
12. Réponds UNIQUEMENT avec le JSON, rien d'autre."""


def generate_adapted_cv(job_text: str, profile: dict) -> dict:
    user_prompt = _build_user_prompt(job_text, profile)

    for attempt in range(2):
        try:
            response = client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=MAX_TOKENS,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_prompt}],
            )
            content = response.content[0].text.strip()
            # Remove markdown fences if present
            if content.startswith("```"):
                content = content.split("\n", 1)[1]
                content = content.rsplit("```", 1)[0]
            data = json.loads(content)

            # Validate required keys
            required = ["nom_entreprise", "titre_poste", "resume_professionnel", "competences", "atouts", "experiences", "lettre_motivation"]
            missing = [k for k in required if k not in data]
            if missing:
                raise ValueError(f"Clés manquantes : {missing}")

            return data

        except json.JSONDecodeError:
            if attempt == 0:
                print("[!] Réponse JSON invalide, nouvelle tentative...")
                user_prompt += "\n\nTA RÉPONSE PRÉCÉDENTE N'ÉTAIT PAS DU JSON VALIDE. Réponds UNIQUEMENT avec du JSON valide."
            else:
                raise RuntimeError("Impossible d'obtenir une réponse JSON valide après 2 tentatives.")
        except ValueError as e:
            if attempt == 0:
                print(f"[!] {e}, nouvelle tentative...")
            else:
                raise

    raise RuntimeError("Échec de la génération.")
