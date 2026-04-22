import io

from fpdf import FPDF

from app.config import settings
from app.services.cv_templates._shared import register_fonts

LEFT_W = 65
RIGHT_X = 75
RIGHT_W = 125
MARGIN = 10
PAGE_H = 297
PHOTO_SIZE = 30


class CvPDF(FPDF):
    def __init__(self):
        super().__init__("P", "mm", "A4")
        self.set_auto_page_break(auto=False)
        self.add_page()
        self.font_family_name = register_fonts(self)

    def _draw_left_background(self):
        r, g, b = settings.left_col_color
        self.set_fill_color(r, g, b)
        self.rect(0, 0, LEFT_W + MARGIN, PAGE_H, "F")

    def _set_left_style(self, size=9, bold=False):
        style = "B" if bold else ""
        self.set_font(self.font_family_name, style, size)
        self.set_text_color(255, 255, 255)

    def _set_right_style(self, size=9, bold=False, italic=False):
        style = ""
        if bold:
            style += "B"
        if italic:
            style += "I"
        self.set_font(self.font_family_name, style, size)
        self.set_text_color(50, 50, 50)

    def _section_header_left(self, title, y):
        self.set_xy(MARGIN, y)
        self._set_left_style(11, bold=True)
        self.cell(LEFT_W, 6, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(255, 255, 255)
        self.set_line_width(0.3)
        self.line(MARGIN, self.get_y(), MARGIN + LEFT_W - 5, self.get_y())
        return self.get_y() + 3

    def _section_header_right(self, title, y):
        self.set_xy(RIGHT_X, y)
        self.set_font(self.font_family_name, "B", 12)
        self.set_text_color(*settings.left_col_color)
        self.cell(RIGHT_W, 7, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*settings.left_col_color)
        self.set_line_width(0.4)
        self.line(RIGHT_X, self.get_y(), RIGHT_X + RIGHT_W - 5, self.get_y())
        return self.get_y() + 3


def generate(
    adapted: dict,
    profile_data: dict,
    photo_bytes: bytes | None = None,
) -> bytes:
    pdf = CvPDF()
    font = pdf.font_family_name

    # ===== LEFT COLUMN =====
    pdf._draw_left_background()

    photo_x = MARGIN
    photo_y = 10
    if photo_bytes:
        pdf.image(io.BytesIO(photo_bytes), x=photo_x, y=photo_y, w=PHOTO_SIZE, h=PHOTO_SIZE)
    y_after_photo = photo_y + PHOTO_SIZE + 4

    pdf.set_xy(MARGIN, y_after_photo)
    pdf._set_left_style(18, bold=True)
    pdf.cell(LEFT_W, 9, profile_data["full_name"], new_x="LMARGIN", new_y="NEXT")

    pdf.set_x(MARGIN)
    pdf._set_left_style(10)
    pdf.multi_cell(LEFT_W, 5, adapted["titre_poste"], new_x="LMARGIN", new_y="NEXT")
    y = pdf.get_y() + 5

    y = pdf._section_header_left("CONTACT", y)
    contact_fields = ["email", "phone", "address", "age", "permis", "vehicule"]
    for field in contact_fields:
        value = profile_data.get(field)
        if value:
            pdf.set_xy(MARGIN, y)
            pdf._set_left_style(8)
            pdf.multi_cell(LEFT_W, 4, value, new_x="LMARGIN", new_y="NEXT")
            y = pdf.get_y() + 1
    y += 3

    y = pdf._section_header_left("COMPÉTENCES", y)
    for skill in adapted["competences"][:12]:
        pdf.set_xy(MARGIN, y)
        pdf._set_left_style(8)
        pdf.cell(LEFT_W, 4, f"• {skill}", new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 0.5
    y += 3

    y = pdf._section_header_left("LANGUES", y)
    for lang in profile_data.get("languages", []):
        pdf.set_xy(MARGIN, y)
        pdf._set_left_style(8)
        pdf.cell(LEFT_W, 4, f"• {lang}", new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 0.5
    y += 3

    y = pdf._section_header_left("ATOUTS", y)
    for atout in adapted["atouts"][:6]:
        pdf.set_xy(MARGIN, y)
        pdf._set_left_style(8)
        pdf.cell(LEFT_W, 4, f"• {atout}", new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 0.5

    # ===== RIGHT COLUMN =====
    y_right = 12

    pdf.set_xy(RIGHT_X, y_right)
    pdf.set_font(font, "I", 9)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(RIGHT_W, 5, adapted["resume_professionnel"], new_x="LMARGIN", new_y="NEXT")
    y_right = pdf.get_y() + 5

    y_right = pdf._section_header_right("EXPÉRIENCES PROFESSIONNELLES", y_right)

    for exp in adapted["experiences"]:
        pdf.set_xy(RIGHT_X, y_right)
        pdf.set_font(font, "B", 9)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(RIGHT_W, 5, f"{exp['title']} | {exp['company']}", new_x="LMARGIN", new_y="NEXT")
        y_right = pdf.get_y()

        pdf.set_xy(RIGHT_X, y_right)
        pdf.set_font(font, "I", 8)
        pdf.set_text_color(120, 120, 120)
        location = exp.get("location", "")
        date_loc = exp.get("dates", "")
        if location:
            date_loc += f" — {location}"
        pdf.cell(RIGHT_W, 4, date_loc, new_x="LMARGIN", new_y="NEXT")
        y_right = pdf.get_y() + 1

        for bullet in exp.get("bullets", []):
            pdf.set_xy(RIGHT_X + 2, y_right)
            pdf.set_font(font, "", 8)
            pdf.set_text_color(60, 60, 60)
            pdf.multi_cell(RIGHT_W - 4, 4, f"• {bullet}", new_x="LMARGIN", new_y="NEXT")
            y_right = pdf.get_y() + 0.5

        y_right += 3

    y_right = pdf._section_header_right("FORMATION", y_right)

    for edu in profile_data.get("education", []):
        pdf.set_xy(RIGHT_X, y_right)
        pdf.set_font(font, "B", 9)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(RIGHT_W, 5, edu["title"], new_x="LMARGIN", new_y="NEXT")
        y_right = pdf.get_y()

        pdf.set_xy(RIGHT_X, y_right)
        pdf.set_font(font, "I", 8)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(
            RIGHT_W, 4,
            f"{edu.get('school', '')} — {edu.get('dates', '')}",
            new_x="LMARGIN", new_y="NEXT",
        )
        y_right = pdf.get_y() + 3

    return pdf.output()
