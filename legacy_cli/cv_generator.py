from pathlib import Path
from fpdf import FPDF
from config import OUTPUT_DIR, LEFT_COL_COLOR, BASE_DIR

FONTS_DIR = "C:/Windows/Fonts"
LEFT_W = 65
RIGHT_X = 75
RIGHT_W = 125
MARGIN = 10
PAGE_H = 297
PHOTO_PATH = str(BASE_DIR / "1767540873756.jpeg")
PHOTO_SIZE = 30  # mm (diameter of the circular crop area)


class CvPDF(FPDF):
    def __init__(self):
        super().__init__("P", "mm", "A4")
        self.set_auto_page_break(auto=False)
        self.add_page()
        self._register_fonts()

    def _register_fonts(self):
        try:
            self.add_font("Calibri", "", f"{FONTS_DIR}/calibri.ttf", uni=True)
            self.add_font("Calibri", "B", f"{FONTS_DIR}/calibrib.ttf", uni=True)
            self.add_font("Calibri", "I", f"{FONTS_DIR}/calibrii.ttf", uni=True)
            self.font_family_name = "Calibri"
        except Exception:
            self.font_family_name = "Helvetica"

    def _draw_left_background(self):
        r, g, b = LEFT_COL_COLOR
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
        # Underline
        self.set_draw_color(255, 255, 255)
        self.set_line_width(0.3)
        self.line(MARGIN, self.get_y(), MARGIN + LEFT_W - 5, self.get_y())
        return self.get_y() + 3

    def _section_header_right(self, title, y):
        self.set_xy(RIGHT_X, y)
        self.set_font(self.font_family_name, "B", 12)
        self.set_text_color(*LEFT_COL_COLOR)
        self.cell(RIGHT_W, 7, title, new_x="LMARGIN", new_y="NEXT")
        # Underline
        self.set_draw_color(*LEFT_COL_COLOR)
        self.set_line_width(0.4)
        self.line(RIGHT_X, self.get_y(), RIGHT_X + RIGHT_W - 5, self.get_y())
        return self.get_y() + 3


def generate_cv_pdf(adapted: dict, profile: dict, output_path: str):
    pdf = CvPDF()
    font = pdf.font_family_name

    # ===== LEFT COLUMN =====
    pdf._draw_left_background()

    # Photo
    photo_x = MARGIN + (LEFT_W - PHOTO_SIZE) / 2
    photo_y = 10
    if Path(PHOTO_PATH).exists():
        # Draw circular clip for photo effect
        pdf.image(PHOTO_PATH, x=photo_x, y=photo_y, w=PHOTO_SIZE, h=PHOTO_SIZE)
    y_after_photo = photo_y + PHOTO_SIZE + 4

    # Name
    pdf.set_xy(MARGIN, y_after_photo)
    pdf._set_left_style(18, bold=True)
    pdf.cell(LEFT_W, 9, profile["name"], new_x="LMARGIN", new_y="NEXT")

    # Title
    pdf.set_x(MARGIN)
    pdf._set_left_style(10)
    pdf.multi_cell(LEFT_W, 5, adapted["titre_poste"], new_x="LMARGIN", new_y="NEXT")
    y = pdf.get_y() + 5

    # Contact
    y = pdf._section_header_left("CONTACT", y)
    contact = profile["contact"]
    contact_items = [
        contact["email"],
        contact["phone"],
        contact["address"],
        contact["age"],
        contact["permis"],
        contact["vehicule"],
    ]
    for item in contact_items:
        pdf.set_xy(MARGIN, y)
        pdf._set_left_style(8)
        pdf.multi_cell(LEFT_W, 4, item, new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 1

    y += 3

    # Competences
    y = pdf._section_header_left("COMPÉTENCES", y)
    for skill in adapted["competences"][:12]:
        pdf.set_xy(MARGIN, y)
        pdf._set_left_style(8)
        pdf.cell(LEFT_W, 4, f"• {skill}", new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 0.5

    y += 3

    # Languages
    y = pdf._section_header_left("LANGUES", y)
    for lang in profile["languages"]:
        pdf.set_xy(MARGIN, y)
        pdf._set_left_style(8)
        pdf.cell(LEFT_W, 4, f"• {lang}", new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 0.5

    y += 3

    # Atouts
    y = pdf._section_header_left("ATOUTS", y)
    for atout in adapted["atouts"][:6]:
        pdf.set_xy(MARGIN, y)
        pdf._set_left_style(8)
        pdf.cell(LEFT_W, 4, f"• {atout}", new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 0.5

    # ===== RIGHT COLUMN =====
    y_right = 12

    # Professional summary
    pdf.set_xy(RIGHT_X, y_right)
    pdf.set_font(font, "I", 9)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(RIGHT_W, 5, adapted["resume_professionnel"], new_x="LMARGIN", new_y="NEXT")
    y_right = pdf.get_y() + 5

    # Experiences
    y_right = pdf._section_header_right("EXPÉRIENCES PROFESSIONNELLES", y_right)

    for exp in adapted["experiences"]:
        # Title + Company
        pdf.set_xy(RIGHT_X, y_right)
        pdf.set_font(font, "B", 9)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(RIGHT_W, 5, f"{exp['title']} | {exp['company']}", new_x="LMARGIN", new_y="NEXT")
        y_right = pdf.get_y()

        # Dates + Location
        pdf.set_xy(RIGHT_X, y_right)
        pdf.set_font(font, "I", 8)
        pdf.set_text_color(120, 120, 120)
        location = exp.get("location", "")
        date_loc = exp["dates"]
        if location:
            date_loc += f" — {location}"
        pdf.cell(RIGHT_W, 4, date_loc, new_x="LMARGIN", new_y="NEXT")
        y_right = pdf.get_y() + 1

        # Bullets
        for bullet in exp.get("bullets", []):
            pdf.set_xy(RIGHT_X + 2, y_right)
            pdf.set_font(font, "", 8)
            pdf.set_text_color(60, 60, 60)
            pdf.multi_cell(RIGHT_W - 4, 4, f"• {bullet}", new_x="LMARGIN", new_y="NEXT")
            y_right = pdf.get_y() + 0.5

        y_right += 3

    # Education
    y_right = pdf._section_header_right("FORMATION", y_right)

    for edu in profile["education"]:
        pdf.set_xy(RIGHT_X, y_right)
        pdf.set_font(font, "B", 9)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(RIGHT_W, 5, edu["title"], new_x="LMARGIN", new_y="NEXT")
        y_right = pdf.get_y()

        pdf.set_xy(RIGHT_X, y_right)
        pdf.set_font(font, "I", 8)
        pdf.set_text_color(120, 120, 120)
        pdf.cell(RIGHT_W, 4, f"{edu['school']} — {edu['dates']}", new_x="LMARGIN", new_y="NEXT")
        y_right = pdf.get_y() + 3

    pdf.output(output_path)
    return output_path
