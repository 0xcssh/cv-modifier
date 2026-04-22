"""Generate PNG previews of the 4 CV templates using fake profile data.

Run once (and rerun if templates change) :
    cd backend && python scripts/generate_template_previews.py

Outputs: frontend/public/templates/{classic,modern,minimalist,creative}.png
"""
import sys
from pathlib import Path

# Make backend importable when run from anywhere
BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

import fitz  # PyMuPDF

from app.services.cv_templates import generate_cv_pdf

OUTPUT_DIR = BACKEND_DIR.parent / "frontend" / "public" / "templates"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FAKE_PROFILE = {
    "full_name": "Marie Dupont",
    "email": "marie.dupont@example.fr",
    "phone": "06 12 34 56 78",
    "address": "12 rue de la Paix, Paris",
    "city": "Paris",
    "age": "28 ans",
    "permis": "Permis B",
    "vehicule": "Véhicule personnel",
    "gender": "female",
    "skills": [
        "Vente BtoB",
        "Prospection commerciale",
        "CRM Salesforce",
        "Négociation",
        "Gestion de portefeuille",
        "Cycle de vente",
    ],
    "languages": ["Anglais", "Espagnol"],
    "soft_skills": [
        "Autonome",
        "Rigoureuse",
        "Orientée résultat",
        "Persévérante",
    ],
    "education": [
        {
            "title": "Master Management & Stratégie",
            "school": "ESCP Business School",
            "location": "Paris",
            "dates": "2020 - 2022",
        },
        {
            "title": "Licence Économie",
            "school": "Université Paris-Dauphine",
            "location": "Paris",
            "dates": "2017 - 2020",
        },
    ],
    "experiences": [
        {
            "title": "Ingénieure Commerciale",
            "company": "TechSolutions",
            "location": "Paris",
            "dates": "2023 - présent",
            "bullets": [
                "Prospection et développement d'un portefeuille de clients grands comptes",
                "Pilotage de cycles de vente complexes avec approche conseil",
                "Gestion de la relation client et fidélisation",
            ],
        },
        {
            "title": "Business Developer",
            "company": "StartupCloud",
            "location": "Paris",
            "dates": "2022 - 2023",
            "bullets": [
                "Génération de leads qualifiés via stratégies multicanales",
                "Négociation et closing de contrats BtoB",
                "Animation d'une équipe de 3 SDR",
            ],
        },
    ],
}

FAKE_ADAPTED = {
    "nom_entreprise": "TechCorp",
    "titre_poste": "Ingénieure Commerciale IT",
    "resume_professionnel": (
        "Ingénieure commerciale passionnée par la vente BtoB de solutions IT. "
        "Expertise en prospection, gestion de portefeuille grands comptes et "
        "pilotage de cycles de vente complexes. 3 ans d'expérience confirmée."
    ),
    "competences": FAKE_PROFILE["skills"],
    "atouts": FAKE_PROFILE["soft_skills"],
    "experiences": FAKE_PROFILE["experiences"],
    "lettre_motivation": "",
}

TEMPLATE_IDS = ["classic", "modern", "minimalist", "creative"]


def pdf_to_png(pdf_bytes: bytes, output_path: Path, zoom: float = 2.0) -> None:
    """Render the first page of a PDF to a PNG at 2x resolution."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    page = doc[0]
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    pix.save(str(output_path))
    doc.close()


def main() -> None:
    for template_id in TEMPLATE_IDS:
        print(f"Generating {template_id}...", end=" ", flush=True)
        pdf_bytes = generate_cv_pdf(template_id, FAKE_ADAPTED, FAKE_PROFILE, None)
        out = OUTPUT_DIR / f"{template_id}.png"
        pdf_to_png(pdf_bytes, out)
        size_kb = out.stat().st_size // 1024
        print(f"{out.name} ({size_kb} KB)")
    print(f"\nDone. Output: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
