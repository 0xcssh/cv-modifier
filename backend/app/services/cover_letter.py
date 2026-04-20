from datetime import datetime

from fpdf import FPDF

from app.config import settings

FONTS_DIR = settings.fonts_dir

MOIS = [
    "", "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
]


def _get_date_fr(city: str = "Toulouse") -> str:
    now = datetime.now()
    return f"{city}, le {now.day} {MOIS[now.month]} {now.year}"


def generate_cover_letter_pdf(
    letter_text: str,
    profile_data: dict,
    adapted: dict,
) -> bytes:
    """Generate a cover letter PDF and return it as bytes."""
    pdf = FPDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()

    try:
        pdf.add_font("Carlito", "", str(FONTS_DIR / "Carlito-Regular.ttf"), uni=True)
        pdf.add_font("Carlito", "B", str(FONTS_DIR / "Carlito-Bold.ttf"), uni=True)
        pdf.add_font("Carlito", "I", str(FONTS_DIR / "Carlito-Italic.ttf"), uni=True)
        font = "Carlito"
    except Exception:
        font = "Helvetica"

    margin_left = 20
    margin_right = 20
    usable_width = 210 - margin_left - margin_right

    # === Sender info (top left) ===
    pdf.set_xy(margin_left, 20)
    pdf.set_font(font, "B", 12)
    pdf.set_text_color(44, 62, 80)
    pdf.cell(usable_width / 2, 6, profile_data["full_name"], new_x="LMARGIN", new_y="NEXT")

    pdf.set_x(margin_left)
    pdf.set_font(font, "", 10)
    pdf.set_text_color(80, 80, 80)
    for field in ["address", "phone", "email"]:
        value = profile_data.get(field)
        if value:
            pdf.set_x(margin_left)
            pdf.cell(usable_width / 2, 5, value, new_x="LMARGIN", new_y="NEXT")

    # === Date (top right) ===
    city = profile_data.get("city", "Toulouse")
    pdf.set_xy(margin_left + usable_width / 2, 20)
    pdf.set_font(font, "I", 10)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(usable_width / 2, 6, _get_date_fr(city), align="R", new_x="LMARGIN", new_y="NEXT")

    # === Object line ===
    y = 60
    pdf.set_xy(margin_left, y)
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(44, 62, 80)
    pdf.cell(
        usable_width, 7,
        f"Objet : Candidature au poste de {adapted['titre_poste']}",
        new_x="LMARGIN", new_y="NEXT",
    )

    y = pdf.get_y() + 8

    # === Salutation ===
    pdf.set_xy(margin_left, y)
    pdf.set_font(font, "", 11)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(usable_width, 6, "Madame, Monsieur,", new_x="LMARGIN", new_y="NEXT")
    y = pdf.get_y() + 5

    # === Body ===
    # Remove leading salutation if Claude included one
    cleaned = letter_text.strip()
    for salut in ["Madame, Monsieur,", "Madame, Monsieur", "Monsieur, Madame,"]:
        if cleaned.startswith(salut):
            cleaned = cleaned[len(salut):].strip()
            break

    paragraphs = cleaned.split("\n\n")
    pdf.set_font(font, "", 10.5)
    pdf.set_text_color(50, 50, 50)

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        pdf.set_xy(margin_left, y)
        pdf.multi_cell(usable_width, 5.5, para, align="J", new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 4

    # === Closing ===
    y = pdf.get_y() + 5
    pdf.set_xy(margin_left, y)
    pdf.set_font(font, "", 10.5)
    pdf.cell(
        usable_width, 6,
        "Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur,",
        new_x="LMARGIN", new_y="NEXT",
    )
    pdf.set_x(margin_left)
    pdf.cell(usable_width, 6, "l'expression de mes salutations distinguées.", new_x="LMARGIN", new_y="NEXT")

    # === Signature ===
    y = pdf.get_y() + 10
    pdf.set_xy(margin_left + usable_width - 60, y)
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(44, 62, 80)
    pdf.cell(60, 6, profile_data["full_name"], align="R")

    return pdf.output()
