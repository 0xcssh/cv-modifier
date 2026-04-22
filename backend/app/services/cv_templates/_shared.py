import io

from fpdf import FPDF

from app.config import settings

FONTS_DIR = settings.fonts_dir
PAGE_W = 210
PAGE_H = 297


def register_fonts(pdf: FPDF) -> str:
    """Register the Carlito font family on the given FPDF instance.

    Returns the font family name to use ("Carlito" if successful, else "Helvetica").
    """
    try:
        pdf.add_font("Carlito", "", str(FONTS_DIR / "Carlito-Regular.ttf"), uni=True)
        pdf.add_font("Carlito", "B", str(FONTS_DIR / "Carlito-Bold.ttf"), uni=True)
        pdf.add_font("Carlito", "I", str(FONTS_DIR / "Carlito-Italic.ttf"), uni=True)
        return "Carlito"
    except Exception:
        return "Helvetica"


def set_fill(pdf: FPDF, rgb: tuple[int, int, int]) -> None:
    pdf.set_fill_color(*rgb)


def set_draw(pdf: FPDF, rgb: tuple[int, int, int]) -> None:
    pdf.set_draw_color(*rgb)


def set_text(pdf: FPDF, rgb: tuple[int, int, int]) -> None:
    pdf.set_text_color(*rgb)


def draw_circle_photo(
    pdf: FPDF,
    photo_bytes: bytes,
    cx: float,
    cy: float,
    radius: float,
) -> None:
    """Draw a photo clipped to a circle of the given radius centered at (cx, cy).

    Falls back to a square photo if clipping is not available.
    """
    size = radius * 2
    x = cx - radius
    y = cy - radius

    try:
        with pdf.elliptic_clip(x=x, y=y, w=size, h=size):
            pdf.image(io.BytesIO(photo_bytes), x=x, y=y, w=size, h=size)
        return
    except Exception:
        pass

    # Fallback: plain square photo
    pdf.image(io.BytesIO(photo_bytes), x=x, y=y, w=size, h=size)


def place_image(pdf: FPDF, photo_bytes: bytes, x: float, y: float, w: float, h: float) -> None:
    pdf.image(io.BytesIO(photo_bytes), x=x, y=y, w=w, h=h)
