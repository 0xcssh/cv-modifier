from fpdf import FPDF

from app.services.cv_templates._shared import (
    PAGE_H,
    PAGE_W,
    place_image,
    register_fonts,
)

BLACK = (20, 20, 20)
GREY = (110, 110, 110)
ACCENT = (5, 150, 105)  # emerald
MARGIN = 20
PHOTO_SIZE = 24


def _rule(pdf: FPDF, y: float) -> None:
    pdf.set_draw_color(*ACCENT)
    pdf.set_line_width(0.35)
    pdf.line(MARGIN, y, MARGIN + 35, y)


def _section_title(pdf: FPDF, font: str, title: str, y: float) -> float:
    pdf.set_xy(MARGIN, y)
    pdf.set_font(font, "B", 10)
    pdf.set_text_color(*BLACK)
    # Letter-spaced title look via uppercase (FPDF has no letter-spacing API).
    pdf.cell(PAGE_W - 2 * MARGIN, 5, title.upper(), new_x="LMARGIN", new_y="NEXT")
    _rule(pdf, pdf.get_y() + 0.5)
    return pdf.get_y() + 4


def generate(
    adapted: dict,
    profile_data: dict,
    photo_bytes: bytes | None = None,
) -> bytes:
    pdf = FPDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()
    font = register_fonts(pdf)

    # ===== HEADER =====
    header_right_x = PAGE_W - MARGIN
    name_right_limit = header_right_x
    if photo_bytes:
        photo_x = header_right_x - PHOTO_SIZE
        photo_y = MARGIN
        place_image(pdf, photo_bytes, photo_x, photo_y, PHOTO_SIZE, PHOTO_SIZE)
        name_right_limit = photo_x - 4

    pdf.set_xy(MARGIN, MARGIN + 2)
    pdf.set_font(font, "B", 24)
    pdf.set_text_color(*BLACK)
    pdf.cell(name_right_limit - MARGIN, 10, profile_data["full_name"], new_x="LMARGIN", new_y="NEXT")

    pdf.set_xy(MARGIN, pdf.get_y() + 1)
    pdf.set_font(font, "", 12)
    pdf.set_text_color(*GREY)
    pdf.multi_cell(name_right_limit - MARGIN, 6, adapted["titre_poste"], new_x="LMARGIN", new_y="NEXT")

    # Contact line
    contact_bits = []
    for k in ("email", "phone", "city", "address"):
        v = profile_data.get(k)
        if v:
            contact_bits.append(v)
    if contact_bits:
        pdf.set_xy(MARGIN, pdf.get_y() + 2)
        pdf.set_font(font, "", 9)
        pdf.set_text_color(*GREY)
        pdf.multi_cell(PAGE_W - 2 * MARGIN, 5, "   /   ".join(contact_bits), new_x="LMARGIN", new_y="NEXT")

    y = max(pdf.get_y() + 8, MARGIN + PHOTO_SIZE + 6) if photo_bytes else pdf.get_y() + 8

    # ===== RESUME =====
    pdf.set_xy(MARGIN, y)
    pdf.set_font(font, "", 10)
    pdf.set_text_color(*BLACK)
    pdf.multi_cell(PAGE_W - 2 * MARGIN, 5.5, adapted["resume_professionnel"], new_x="LMARGIN", new_y="NEXT")
    y = pdf.get_y() + 7

    # ===== EXPERIENCES =====
    y = _section_title(pdf, font, "Expériences", y)
    for exp in adapted["experiences"]:
        if y > PAGE_H - 30:
            break
        pdf.set_xy(MARGIN, y)
        pdf.set_font(font, "B", 10.5)
        pdf.set_text_color(*BLACK)
        pdf.cell(PAGE_W - 2 * MARGIN, 5.5, exp["title"], new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(MARGIN, pdf.get_y())
        pdf.set_font(font, "I", 9)
        pdf.set_text_color(*GREY)
        company = exp.get("company", "")
        dates = exp.get("dates", "")
        loc = exp.get("location", "")
        parts = [p for p in (company, dates, loc) if p]
        pdf.cell(PAGE_W - 2 * MARGIN, 5, "  —  ".join(parts), new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 1.5

        pdf.set_font(font, "", 9.5)
        pdf.set_text_color(*BLACK)
        for bullet in exp.get("bullets", []):
            pdf.set_xy(MARGIN + 3, y)
            pdf.multi_cell(PAGE_W - 2 * MARGIN - 3, 5, f"—  {bullet}", new_x="LMARGIN", new_y="NEXT")
            y = pdf.get_y() + 1
        y += 4

    # ===== FORMATION =====
    if y < PAGE_H - 25:
        y = _section_title(pdf, font, "Formation", y)
        for edu in profile_data.get("education", []):
            if y > PAGE_H - 18:
                break
            pdf.set_xy(MARGIN, y)
            pdf.set_font(font, "B", 10)
            pdf.set_text_color(*BLACK)
            pdf.cell(PAGE_W - 2 * MARGIN, 5.5, edu["title"], new_x="LMARGIN", new_y="NEXT")

            pdf.set_xy(MARGIN, pdf.get_y())
            pdf.set_font(font, "I", 9)
            pdf.set_text_color(*GREY)
            pdf.cell(
                PAGE_W - 2 * MARGIN, 5,
                f"{edu.get('school', '')}  —  {edu.get('dates', '')}",
                new_x="LMARGIN", new_y="NEXT",
            )
            y = pdf.get_y() + 3

    # ===== COMPETENCES + LANGUES (two-column footer) =====
    if y < PAGE_H - 30:
        y += 3
        col_w = (PAGE_W - 2 * MARGIN) / 2 - 4

        # Competences (left)
        pdf.set_xy(MARGIN, y)
        pdf.set_font(font, "B", 10)
        pdf.set_text_color(*BLACK)
        pdf.cell(col_w, 5, "COMPÉTENCES", new_x="LMARGIN", new_y="NEXT")
        _rule(pdf, pdf.get_y() + 0.5)
        comp_y = pdf.get_y() + 4
        pdf.set_font(font, "", 9)
        for skill in adapted["competences"][:10]:
            if comp_y > PAGE_H - 10:
                break
            pdf.set_xy(MARGIN, comp_y)
            pdf.cell(col_w, 4.5, f"—  {skill}", new_x="LMARGIN", new_y="NEXT")
            comp_y = pdf.get_y() + 0.3

        # Langues (right)
        right_x = MARGIN + col_w + 8
        pdf.set_xy(right_x, y)
        pdf.set_font(font, "B", 10)
        pdf.set_text_color(*BLACK)
        pdf.cell(col_w, 5, "LANGUES", new_x="LMARGIN", new_y="NEXT")
        pdf.set_draw_color(*ACCENT)
        pdf.set_line_width(0.35)
        pdf.line(right_x, pdf.get_y() + 0.5, right_x + 35, pdf.get_y() + 0.5)
        lang_y = pdf.get_y() + 4
        pdf.set_font(font, "", 9)
        pdf.set_text_color(*BLACK)
        for lang in profile_data.get("languages", []):
            if lang_y > PAGE_H - 10:
                break
            pdf.set_xy(right_x, lang_y)
            pdf.cell(col_w, 4.5, f"—  {lang}", new_x="LMARGIN", new_y="NEXT")
            lang_y = pdf.get_y() + 0.3

    return pdf.output()
