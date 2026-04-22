from fpdf import FPDF

from app.services.cv_templates._shared import (
    PAGE_H,
    PAGE_W,
    draw_circle_photo,
    register_fonts,
)

EMERALD = (5, 150, 105)
EMERALD_DARK = (4, 120, 87)
SLATE = (30, 41, 59)
MUTED = (100, 116, 139)
LIGHT_BG = (240, 253, 244)

SIDEBAR_W = 60
CONTENT_X = SIDEBAR_W + 10
CONTENT_W = PAGE_W - CONTENT_X - 10


def _sidebar_header(pdf: FPDF, font: str, title: str, y: float) -> float:
    pdf.set_xy(6, y)
    pdf.set_font(font, "B", 10)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(SIDEBAR_W - 12, 5, title.upper(), new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(255, 255, 255)
    pdf.set_line_width(0.3)
    pdf.line(6, pdf.get_y() + 0.5, 6 + 20, pdf.get_y() + 0.5)
    return pdf.get_y() + 3


def _content_header(pdf: FPDF, font: str, title: str, y: float) -> float:
    pdf.set_xy(CONTENT_X, y)
    pdf.set_font(font, "B", 13)
    pdf.set_text_color(*SLATE)
    pdf.cell(CONTENT_W, 7, title, new_x="LMARGIN", new_y="NEXT")
    pdf.set_draw_color(*EMERALD)
    pdf.set_line_width(0.5)
    pdf.line(CONTENT_X, pdf.get_y() + 0.5, CONTENT_X + 25, pdf.get_y() + 0.5)
    return pdf.get_y() + 4


def _sidebar_chip(pdf: FPDF, font: str, text: str, x: float, y: float, max_right: float) -> tuple[float, float]:
    pdf.set_font(font, "", 8)
    tw = pdf.get_string_width(text) + 4
    h = 5
    if x + tw > max_right:
        x = 6
        y += h + 1.5
    pdf.set_fill_color(*EMERALD_DARK)
    pdf.set_draw_color(*EMERALD_DARK)
    pdf.rect(x, y, tw, h, "F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_xy(x, y)
    pdf.cell(tw, h, text, align="C")
    return x + tw + 1.5, y


def generate(
    adapted: dict,
    profile_data: dict,
    photo_bytes: bytes | None = None,
) -> bytes:
    pdf = FPDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()
    font = register_fonts(pdf)

    # ===== SIDEBAR BACKGROUND =====
    pdf.set_fill_color(*EMERALD)
    pdf.rect(0, 0, SIDEBAR_W, PAGE_H, "F")

    # Photo (round)
    photo_cx = SIDEBAR_W / 2
    photo_cy = 28
    photo_r = 18
    if photo_bytes:
        draw_circle_photo(pdf, photo_bytes, photo_cx, photo_cy, photo_r)
        y_sb = photo_cy + photo_r + 6
    else:
        y_sb = 16

    # Name
    pdf.set_xy(4, y_sb)
    pdf.set_font(font, "B", 14)
    pdf.set_text_color(255, 255, 255)
    pdf.multi_cell(SIDEBAR_W - 8, 6, profile_data["full_name"], align="C", new_x="LMARGIN", new_y="NEXT")
    y_sb = pdf.get_y() + 1

    pdf.set_xy(4, y_sb)
    pdf.set_font(font, "I", 9)
    pdf.set_text_color(209, 250, 229)
    pdf.multi_cell(SIDEBAR_W - 8, 4.5, adapted["titre_poste"], align="C", new_x="LMARGIN", new_y="NEXT")
    y_sb = pdf.get_y() + 6

    # Contact
    y_sb = _sidebar_header(pdf, font, "Contact", y_sb)
    for key in ("email", "phone", "address", "age"):
        v = profile_data.get(key)
        if not v:
            continue
        pdf.set_xy(6, y_sb)
        pdf.set_font(font, "", 7.5)
        pdf.set_text_color(255, 255, 255)
        pdf.multi_cell(SIDEBAR_W - 12, 3.8, v, new_x="LMARGIN", new_y="NEXT")
        y_sb = pdf.get_y() + 0.8
    y_sb += 3

    # Compétences as chips
    y_sb = _sidebar_header(pdf, font, "Compétences", y_sb)
    cx, cy = 6, y_sb
    for skill in adapted["competences"][:10]:
        cx, cy = _sidebar_chip(pdf, font, skill, cx, cy, SIDEBAR_W - 4)
    y_sb = cy + 10

    # Langues
    if profile_data.get("languages"):
        y_sb = _sidebar_header(pdf, font, "Langues", y_sb)
        pdf.set_font(font, "", 8)
        pdf.set_text_color(255, 255, 255)
        for lang in profile_data.get("languages", []):
            if y_sb > PAGE_H - 10:
                break
            pdf.set_xy(6, y_sb)
            pdf.cell(SIDEBAR_W - 12, 4, f"• {lang}", new_x="LMARGIN", new_y="NEXT")
            y_sb = pdf.get_y() + 0.3
        y_sb += 3

    # Atouts
    atouts = adapted.get("atouts") or []
    if atouts and y_sb < PAGE_H - 20:
        y_sb = _sidebar_header(pdf, font, "Atouts", y_sb)
        pdf.set_font(font, "", 7.5)
        pdf.set_text_color(255, 255, 255)
        for atout in atouts[:5]:
            if y_sb > PAGE_H - 8:
                break
            pdf.set_xy(6, y_sb)
            pdf.multi_cell(SIDEBAR_W - 12, 3.8, f"• {atout}", new_x="LMARGIN", new_y="NEXT")
            y_sb = pdf.get_y() + 0.4

    # ===== CONTENT (right column) =====
    y = 14

    # Resume
    pdf.set_xy(CONTENT_X, y)
    pdf.set_font(font, "I", 10)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(CONTENT_W, 5.2, adapted["resume_professionnel"], new_x="LMARGIN", new_y="NEXT")
    y = pdf.get_y() + 5

    # Experiences as timeline
    y = _content_header(pdf, font, "Expériences", y)

    timeline_x = CONTENT_X + 2
    dot_r = 1.6
    text_x = timeline_x + 6
    text_w = CONTENT_W - 8

    experiences = adapted.get("experiences", [])
    for idx, exp in enumerate(experiences):
        if y > PAGE_H - 28:
            break
        entry_top = y

        # Title
        pdf.set_xy(text_x, y)
        pdf.set_font(font, "B", 10.5)
        pdf.set_text_color(*SLATE)
        pdf.cell(text_w, 5.5, f"{exp['title']} — {exp['company']}", new_x="LMARGIN", new_y="NEXT")

        # Dates / location
        pdf.set_xy(text_x, pdf.get_y())
        pdf.set_font(font, "I", 8.5)
        pdf.set_text_color(*EMERALD_DARK)
        loc = exp.get("location", "")
        dates = exp.get("dates", "")
        meta = dates
        if loc:
            meta = f"{dates} — {loc}" if dates else loc
        pdf.cell(text_w, 4.5, meta, new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 1.2

        # Bullets
        pdf.set_font(font, "", 9)
        pdf.set_text_color(60, 60, 60)
        for bullet in exp.get("bullets", []):
            if y > PAGE_H - 12:
                break
            pdf.set_xy(text_x, y)
            pdf.multi_cell(text_w, 4.6, f"•  {bullet}", new_x="LMARGIN", new_y="NEXT")
            y = pdf.get_y() + 0.5

        entry_bottom = y
        # Timeline dot and connecting line
        pdf.set_fill_color(*EMERALD)
        pdf.set_draw_color(*EMERALD)
        pdf.circle(x=timeline_x, y=entry_top + 2.5, radius=dot_r, style="F")
        if idx < len(experiences) - 1 and entry_bottom < PAGE_H - 20:
            pdf.set_line_width(0.4)
            pdf.line(timeline_x, entry_top + 4, timeline_x, entry_bottom + 2)

        y = entry_bottom + 4

    # Formation
    if y < PAGE_H - 20:
        y = _content_header(pdf, font, "Formation", y)
        for edu in profile_data.get("education", []):
            if y > PAGE_H - 12:
                break
            pdf.set_xy(CONTENT_X, y)
            pdf.set_font(font, "B", 10)
            pdf.set_text_color(*SLATE)
            pdf.cell(CONTENT_W, 5, edu["title"], new_x="LMARGIN", new_y="NEXT")
            pdf.set_xy(CONTENT_X, pdf.get_y())
            pdf.set_font(font, "I", 8.5)
            pdf.set_text_color(*EMERALD_DARK)
            pdf.cell(
                CONTENT_W, 4.5,
                f"{edu.get('school', '')} — {edu.get('dates', '')}",
                new_x="LMARGIN", new_y="NEXT",
            )
            y = pdf.get_y() + 3

    return pdf.output()
