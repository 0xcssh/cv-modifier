import re
import sys
from datetime import datetime
from config import ANTHROPIC_API_KEY, OUTPUT_DIR
from profile_data import PROFILE
from scraper import scrape_job_offer
from ai_engine import generate_adapted_cv
from cv_generator import generate_cv_pdf
from cover_letter_generator import generate_cover_letter_pdf


def main():
    if not ANTHROPIC_API_KEY or ANTHROPIC_API_KEY == "your_api_key_here":
        print("[ERREUR] Clé API manquante. Ajoutez votre clé dans le fichier .env :")
        print('  ANTHROPIC_API_KEY=sk-ant-...')
        sys.exit(1)

    print("=" * 60)
    print("  CV MODIFIER — Adaptateur de CV & Lettre de Motivation")
    print("=" * 60)
    print("  Collez l'URL d'une offre d'emploi pour générer un CV")
    print("  et une lettre de motivation adaptés.")
    print('  Tapez "q" pour quitter.\n')

    while True:
        url = input("URL de l'offre > ").strip()
        if url.lower() == "q":
            print("Au revoir !")
            break
        if not url:
            continue

        # 1. Scrape
        print("\n[1/4] Extraction de l'offre d'emploi...")
        job_text = scrape_job_offer(url)
        print(f"  ✓ {len(job_text)} caractères extraits")
        print(f"  Aperçu : {job_text[:150]}...\n")

        # 2. Claude API
        print("[2/4] Analyse et adaptation par Claude...")
        try:
            adapted = generate_adapted_cv(job_text, PROFILE)
        except Exception as e:
            print(f"\n[ERREUR] {e}\n")
            continue
        print(f"  ✓ Titre : {adapted['titre_poste']}")
        print(f"  ✓ {len(adapted['competences'])} compétences, {len(adapted['experiences'])} expériences\n")

        # 3. Generate PDFs
        def slugify(text):
            text = text.lower().strip()
            text = re.sub(r'[àáâãäå]', 'a', text)
            text = re.sub(r'[èéêë]', 'e', text)
            text = re.sub(r'[ìíîï]', 'i', text)
            text = re.sub(r'[òóôõö]', 'o', text)
            text = re.sub(r'[ùúûü]', 'u', text)
            text = re.sub(r'[ç]', 'c', text)
            text = re.sub(r'[^a-z0-9]+', '_', text)
            return text.strip('_')[:40]

        poste = slugify(adapted["titre_poste"])
        entreprise = slugify(adapted.get("nom_entreprise", ""))
        label = f"{poste}_{entreprise}" if entreprise else poste
        cv_path = str(OUTPUT_DIR / f"cv_{label}.pdf")
        lm_path = str(OUTPUT_DIR / f"lm_{label}.pdf")

        print("[3/4] Génération du CV PDF...")
        try:
            generate_cv_pdf(adapted, PROFILE, cv_path)
            print(f"  ✓ {cv_path}")
        except Exception as e:
            print(f"  [ERREUR] CV : {e}")

        print("[4/4] Génération de la lettre de motivation PDF...")
        try:
            generate_cover_letter_pdf(adapted["lettre_motivation"], PROFILE, adapted, lm_path)
            print(f"  ✓ {lm_path}")
        except Exception as e:
            print(f"  [ERREUR] Lettre : {e}")

        print("\n" + "=" * 60)
        print("  Fichiers générés avec succès !")
        print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
