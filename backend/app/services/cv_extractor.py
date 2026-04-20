import json
import logging

import anthropic
from pypdf import PdfReader

from app.config import settings

logger = logging.getLogger(__name__)

EXTRACTION_PROMPT = """Tu es un expert en analyse de CV français.
Extrais TOUTES les informations structurées du CV suivant et retourne un JSON avec cette structure EXACTE :

{
  "full_name": "Prénom Nom",
  "email": "email@example.com",
  "phone": "06 12 34 56 78",
  "address": "Adresse complète",
  "city": "Ville (extraite de l'adresse)",
  "age": "XX ans (si mentionné)",
  "permis": "Permis B (si mentionné)",
  "vehicule": "Véhicule personnel (si mentionné)",
  "education": [
    {
      "title": "Diplôme",
      "school": "École/Université",
      "location": "Ville",
      "dates": "dates"
    }
  ],
  "experiences": [
    {
      "title": "Titre du poste",
      "company": "Entreprise",
      "location": "Ville",
      "dates": "dates",
      "bullets": ["responsabilité 1", "responsabilité 2"]
    }
  ],
  "skills": ["compétence 1", "compétence 2"],
  "languages": ["Français (natif)", "Anglais (B2)"],
  "soft_skills": ["qualité 1", "qualité 2"]
}

RÈGLES :
- Extrais TOUT ce qui est présent dans le CV, ne laisse rien de côté
- Les expériences doivent être dans l'ordre chronologique inversé (la plus récente d'abord)
- Si une information n'est pas dans le CV, mets null ou une liste vide
- Réponds UNIQUEMENT avec le JSON, rien d'autre"""


async def extract_profile_from_pdf(pdf_bytes: bytes) -> dict:
    """Extract structured profile data from a PDF CV using Claude."""
    # 1. Extract text from PDF
    import io
    reader = PdfReader(io.BytesIO(pdf_bytes))
    text_parts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            text_parts.append(text)

    cv_text = "\n".join(text_parts)

    if len(cv_text.strip()) < 50:
        raise ValueError(
            "Impossible d'extraire le texte du PDF. "
            "Le fichier est peut-être scanné ou protégé."
        )

    # 2. Send to Claude for extraction
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    response = await client.messages.create(
        model=settings.claude_model,
        max_tokens=4000,
        system="Tu extrais les informations d'un CV. Réponds UNIQUEMENT en JSON valide.",
        messages=[
            {
                "role": "user",
                "content": f"{EXTRACTION_PROMPT}\n\n---\n\nCV à analyser :\n\n{cv_text}",
            }
        ],
    )

    content = response.content[0].text.strip()

    # Remove markdown fences if present
    if content.startswith("```"):
        content = content.split("\n", 1)[1]
        content = content.rsplit("```", 1)[0]

    data = json.loads(content)

    # Ensure required fields have defaults
    data.setdefault("full_name", "")
    data.setdefault("education", [])
    data.setdefault("experiences", [])
    data.setdefault("skills", [])
    data.setdefault("languages", [])
    data.setdefault("soft_skills", [])

    return data


def extract_photo_from_pdf(pdf_bytes: bytes) -> bytes | None:
    """Extract the largest image from a PDF (likely the profile photo)."""
    import io

    reader = PdfReader(io.BytesIO(pdf_bytes))
    best_image: bytes | None = None
    best_size = 0

    for page in reader.pages:
        for image in page.images:
            image_data = image.data
            if len(image_data) > best_size:
                best_size = len(image_data)
                best_image = image_data

    if best_image and best_size > 1000:
        return best_image

    return None
