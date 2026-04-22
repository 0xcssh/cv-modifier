from fpdf import FPDF

from app.services.cv_templates._shared import (
    PAGE_H,
    PAGE_W,
    draw_circle_photo,
    register_fonts,
)

BLUE = (37, 99, 235)
SLATE = (30, 41, 59)
MUTED = (100, 116, 139)
LIGHT = (241, 245, 249)
MARGIN = 15
HEADER_H = 55


def _section_title(pdf: FPDF, font: str, title: str, y: float) -> float:
    pdf.set_xy(MARGIN, y)
    pdf.set_font(font, "B", 13)
    pdf.set_text_color(*SLATE)
    pdf.cell(PAGE_W - 2 * MARGIN, 7, title, new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(*BLUE)
    pdf.set_line_width(0.6)
    pdf.line(MARGIN, pdf.get_y() + 0.5, MARGIN + 30, pdf.get_y() + 0.5)
    return pdf.get_y() + 5


def _chip(pdf: FPDF, font: str, text: str, x: float, y: float, max_right: float) -> tuple[float, float]:
    pdf.set_font(font, "", 9)
    text_w = pdf.get_string_width(text) + 6
    h = 6
    if x + text_w > max_right:
        x = MARGIN
        y += h + 2
    pdf.set_fill_color(*LIGHT)
    pdf.set_draw_color(*LIGHT)
    pdf.rect(x, y, text_w, h, "F")
    pdf.set_text_color(*SLATE)
    pdf.set_xy(x, y)
    pdf.cell(text_w, h, text, align="C")
    return x + text_w + 3, y


def generate(
    adapted: dict,
    profile_data: dict,
    photo_bytes: bytes | None = None,
) -> bytes:
    pdf = FPDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()
    font = register_fonts(pdf)

    # ===== HEADER BAND =====
    pdf.set_fill_color(*BLUE)
    pdf.rect(0, 0, PAGE_W, HEADER_H, "F")

    photo_radius = 18
    photo_cx = PAGE_W - MARGIN - photo_radius
    photo_cy = HEADER_H / 2
    if photo_bytes:
        draw_circle_photo(pdf, photo_bytes, photo_cx, photo_cy, photo_radius)
        name_right = photo_cx - photo_radius - 4
    else:
        name_right = PAGE_W - MARGIN

    pdf.set_xy(MARGIN, 14)
    pdf.set_font(font, "B", 22)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(name_right - MARGIN, 10, profile_data["full_name"], new_x="LMARGIN", new_y="NEXT")

    pdf.set_xy(MARGIN, pdf.get_y() + 1)
    pdf.set_font(font, "", 12)
    pdf.set_text_color(219, 234, 254)
    pdf.multi_cell(name_right - MARGIN, 6, adapted["titre_poste"], new_x="LMARGIN", new_y="NEXT")

    # Contact line below title
    contact_bits = []
    for k in ("email", "phone", "city"):
        v = profile_data.get(k)
        if v:
            contact_bits.append(v)
    if contact_bits:
        pdf.set_xy(MARGIN, pdf.get_y() + 1)
        pdf.set_font(font, "", 9)
        pdf.set_text_color(219, 234, 254)
        pdf.cell(name_right - MARGIN, 5, "  •  ".join(contact_bits), new_x="LMARGIN", new_y="NEXT")

    y = HEADER_H + 8

    # ===== RESUME =====
    pdf.set_xy(MARGIN, y)
    pdf.set_font(font, "I", 10)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(PAGE_W - 2 * MARGIN, 5.2, adapted["resume_professionnel"], new_x="LMARGIN", new_y="NEXT")
    y = pdf.get_y() + 6

    # ===== COMPETENCES as chips =====
    y = _section_title(pdf, font, "COMPÉTENCES", y)
    cx, cy = MARGIN, y
    max_right = PAGE_W - MARGIN
    for skill in adapted["competences"][:14]:
        cx, cy = _chip(pdf, font, skill, cx, cy, max_right)
    y = cy + 10

    # ===== EXPERIENCES =====
    y = _section_title(pdf, font, "EXPÉRIENCES PROFESSIONNELLES", y)
    for exp in adapted["experiences"]:
        if y > PAGE_H - 30:
            break
        pdf.set_xy(MARGIN, y)
        pdf.set_font(font, "B", 11)
        pdf.set_text_color(*SLATE)
        pdf.cell(PAGE_W - 2 * MARGIN, 6, f"{exp['title']} — {exp['company']}", new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(MARGIN, pdf.get_y())
        pdf.set_font(font, "I", 9)
        pdf.set_text_color(*BLUE)
        loc = exp.get("location", "")
        dates = exp.get("dates", "")
        meta = dates
        if loc:
            meta = f"{dates} — {loc}" if dates else loc
        pdf.cell(PAGE_W - 2 * MARGIN, 5, meta, new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 1.5

        pdf.set_font(font, "", 9.5)
        pdf.set_text_color(60, 60, 60)
        for bullet in exp.get("bullets", []):
            pdf.set_xy(MARGIN + 3, y)
            pdf.multi_cell(PAGE_W - 2 * MARGIN - 3, 5, f"•  {bullet}", new_x="LMARGIN", new_y="NEXT")
            y = pdf.get_y() + 0.8
        y += 4

    # ===== EDUCATION =====
    if y > PAGE_H - 25:
        return pdf.output()
    y = _section_title(pdf, font, "FORMATION", y)
    for edu in profile_data.get("education", []):
        if y > PAGE_H - 18:
            break
        pdf.set_xy(MARGIN, y)
        pdf.set_font(font, "B", 10.5)
        pdf.set_text_color(*SLATE)
        pdf.cell(PAGE_W - 2 * MARGIN, 5.5, edu["title"], new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(MARGIN, pdf.get_y())
        pdf.set_font(font, "I", 9)
        pdf.set_text_color(*MUTED)
        pdf.cell(
            PAGE_W - 2 * MARGIN, 5,
            f"{edu.get('school', '')} — {edu.get('dates', '')}",
            new_x="LMARGIN", new_y="NEXT",
        )
        y = pdf.get_y() + 3

    # ===== LANGUES (compact row) =====
    langs = profile_data.get("languages", [])
    if langs and y < PAGE_H - 20:
        y += 2
        y = _section_title(pdf, font, "LANGUES", y)
        cx, cy = MARGIN, y
        for lang in langs:
            cx, cy = _chip(pdf, font, lang, cx, cy, PAGE_W - MARGIN)

    return pdf.output()
