import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 6000

BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

# PDF settings
PAGE_WIDTH = 210  # A4 mm
PAGE_HEIGHT = 297
LEFT_COL_WIDTH = 65
RIGHT_COL_WIDTH = 135
MARGIN = 10
LEFT_COL_COLOR = (44, 62, 80)  # #2C3E50
