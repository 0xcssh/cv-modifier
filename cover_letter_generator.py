from datetime import datetime
from fpdf import FPDF

FONTS_DIR = "C:/Windows/Fonts"

MOIS = [
    "", "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
]


def _get_date_fr() -> str:
    now = datetime.now()
    return f"Toulouse, le {now.day} {MOIS[now.month]} {now.year}"


def generate_cover_letter_pdf(letter_text: str, profile: dict, adapted: dict, output_path: str):
    pdf = FPDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()

    # Register fonts
    try:
        pdf.add_font("Calibri", "", f"{FONTS_DIR}/calibri.ttf", uni=True)
        pdf.add_font("Calibri", "B", f"{FONTS_DIR}/calibrib.ttf", uni=True)
        pdf.add_font("Calibri", "I", f"{FONTS_DIR}/calibrii.ttf", uni=True)
        font = "Calibri"
    except Exception:
        font = "Helvetica"

    contact = profile["contact"]
    margin_left = 20
    margin_right = 20
    usable_width = 210 - margin_left - margin_right

    # === Sender info (top left) ===
    pdf.set_xy(margin_left, 20)
    pdf.set_font(font, "B", 12)
    pdf.set_text_color(44, 62, 80)
    pdf.cell(usable_width / 2, 6, profile["name"], new_x="LMARGIN", new_y="NEXT")

    pdf.set_x(margin_left)
    pdf.set_font(font, "", 10)
    pdf.set_text_color(80, 80, 80)
    for info in [contact["address"], contact["phone"], contact["email"]]:
        pdf.set_x(margin_left)
        pdf.cell(usable_width / 2, 5, info, new_x="LMARGIN", new_y="NEXT")

    # === Date (top right) ===
    pdf.set_xy(margin_left + usable_width / 2, 20)
    pdf.set_font(font, "I", 10)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(usable_width / 2, 6, _get_date_fr(), align="R", new_x="LMARGIN", new_y="NEXT")

    # === Object line ===
    y = 60
    pdf.set_xy(margin_left, y)
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(44, 62, 80)
    pdf.cell(usable_width, 7, f"Objet : Candidature au poste de {adapted['titre_poste']}", new_x="LMARGIN", new_y="NEXT")

    y = pdf.get_y() + 8

    # === Salutation ===
    pdf.set_xy(margin_left, y)
    pdf.set_font(font, "", 11)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(usable_width, 6, "Madame, Monsieur,", new_x="LMARGIN", new_y="NEXT")
    y = pdf.get_y() + 5

    # === Body ===
    # Remove leading salutation if Claude included one (already added above)
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
    pdf.cell(usable_width, 6, "Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur,", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(margin_left)
    pdf.cell(usable_width, 6, "l'expression de mes salutations distinguées.", new_x="LMARGIN", new_y="NEXT")

    # === Signature ===
    y = pdf.get_y() + 10
    pdf.set_xy(margin_left + usable_width - 60, y)
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(44, 62, 80)
    pdf.cell(60, 6, profile["name"], align="R")

    pdf.output(output_path)
    return output_path
