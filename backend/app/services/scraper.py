import logging
from dataclasses import dataclass

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
}

MAX_TEXT_LENGTH = 8000

BLOCK_PATTERNS = [
    "requête bloquée",
    "access denied",
    "cloudflare",
    "ray id",
    "robot check",
    "verify you are human",
    "unusual traffic",
    "captcha",
]


def _is_blocked_page(text: str) -> bool:
    lower = text.lower()
    return sum(1 for p in BLOCK_PATTERNS if p in lower) >= 2


@dataclass
class ScrapingResult:
    text: str
    char_count: int
    method: str  # "requests", "playwright"
    success: bool
    error: str | None = None


def _clean_html(soup: BeautifulSoup) -> str:
    for tag in soup(
        ["script", "style", "nav", "footer", "header", "noscript", "svg", "img"]
    ):
        tag.decompose()

    for selector in [
        "article",
        "main",
        "[class*='job']",
        "[class*='description']",
        "[id*='job']",
    ]:
        el = soup.select_one(selector)
        if el and len(el.get_text(strip=True)) > 100:
            return el.get_text(separator="\n", strip=True)[:MAX_TEXT_LENGTH]

    return soup.get_text(separator="\n", strip=True)[:MAX_TEXT_LENGTH]


async def _scrape_with_requests(url: str) -> ScrapingResult:
    try:
        async with httpx.AsyncClient(
            headers=HEADERS, follow_redirects=True, timeout=20.0
        ) as client:
            resp = await client.get(url)
            resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        text = _clean_html(soup)

        if len(text.strip()) < 100:
            return ScrapingResult(
                text="", char_count=0, method="requests", success=False,
                error="Contenu insuffisant (site SPA probable)",
            )

        if _is_blocked_page(text):
            return ScrapingResult(
                text="", char_count=0, method="requests", success=False,
                error="Le site bloque l'extraction automatique. Copiez-collez le texte de l'offre manuellement.",
            )

        return ScrapingResult(
            text=text, char_count=len(text), method="requests", success=True,
        )
    except Exception as e:
        return ScrapingResult(
            text="", char_count=0, method="requests", success=False, error=str(e),
        )


async def _scrape_with_playwright(url: str) -> ScrapingResult:
    try:
        from playwright.async_api import async_playwright

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, wait_until="networkidle", timeout=30000)
            await page.wait_for_timeout(2000)
            html = await page.content()
            await browser.close()

        soup = BeautifulSoup(html, "html.parser")
        text = _clean_html(soup)

        if len(text.strip()) < 100:
            return ScrapingResult(
                text="", char_count=0, method="playwright", success=False,
                error="Contenu insuffisant même avec navigateur",
            )

        if _is_blocked_page(text):
            return ScrapingResult(
                text="", char_count=0, method="playwright", success=False,
                error="Le site bloque l'extraction automatique (Indeed, LinkedIn). Copiez-collez le texte de l'offre manuellement dans le champ ci-dessous.",
            )

        return ScrapingResult(
            text=text, char_count=len(text), method="playwright", success=True,
        )
    except Exception as e:
        return ScrapingResult(
            text="", char_count=0, method="playwright", success=False, error=str(e),
        )


async def scrape_job_offer(url: str) -> ScrapingResult:
    """Scrape a job offer URL. Tries requests first, then Playwright as fallback."""
    # 1. Try httpx (fast)
    result = await _scrape_with_requests(url)
    if result.success:
        return result

    logger.info(f"requests failed ({result.error}), trying Playwright...")

    # 2. Fallback to Playwright
    result = await _scrape_with_playwright(url)
    if result.success:
        return result

    # 3. Both failed
    return ScrapingResult(
        text="",
        char_count=0,
        method="none",
        success=False,
        error="Impossible d'extraire le contenu. Veuillez coller le texte manuellement.",
    )
