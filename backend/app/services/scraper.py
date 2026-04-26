import asyncio
import ipaddress
import logging
import re
import socket
from dataclasses import dataclass
from urllib.parse import parse_qs, urlparse

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


async def _validate_url(url: str) -> None:
    """Reject non-http(s) schemes and hosts resolving to private/loopback/link-local IPs (SSRF guard)."""
    if not isinstance(url, str) or not url.strip():
        raise ValueError("URL non autorisée.")

    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("URL non autorisée.")

    hostname = parsed.hostname
    if not hostname or "." not in hostname:
        raise ValueError("URL non autorisée.")

    try:
        infos = await asyncio.to_thread(
            socket.getaddrinfo, hostname, None, 0, socket.SOCK_STREAM
        )
    except socket.gaierror:
        raise ValueError("URL non autorisée.")

    if not infos:
        raise ValueError("URL non autorisée.")

    for info in infos:
        addr = info[4][0]
        try:
            ip = ipaddress.ip_address(addr.split("%", 1)[0])
        except ValueError:
            raise ValueError("URL non autorisée.")
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_multicast
            or ip.is_reserved
            or ip.is_unspecified
        ):
            raise ValueError("URL non autorisée.")

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


def _normalize_url(url: str) -> str:
    """Transform common URL formats to direct job URLs for better scraping."""
    parsed = urlparse(url)

    # LinkedIn: /jobs/collections/... or /jobs/search/... with currentJobId
    if "linkedin.com" in parsed.netloc:
        params = parse_qs(parsed.query)
        job_id = params.get("currentJobId", [None])[0]
        if job_id:
            return f"https://www.linkedin.com/jobs/view/{job_id}/"
        # Extract ID from /jobs/view/ID/... URLs as well
        match = re.search(r"/jobs/view/(\d+)", parsed.path)
        if match:
            return f"https://www.linkedin.com/jobs/view/{match.group(1)}/"

    return url


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


# Alternate UA used on retry — sites that fingerprint the first request
# sometimes accept a different UA on the second try.
_RETRY_HEADERS = {
    **HEADERS,
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "Version/17.5 Safari/605.1.15"
    ),
}


async def _scrape_with_requests(url: str) -> ScrapingResult:
    """Try httpx twice (Chrome UA then Safari UA) before giving up.

    Each attempt gets 8 s — total at most 16 s — which still leaves headroom
    before we fall back to the (much slower) Playwright path.
    """
    last_error: str | None = None
    for attempt, headers in enumerate((HEADERS, _RETRY_HEADERS), start=1):
        try:
            async with httpx.AsyncClient(
                headers=headers, follow_redirects=True, timeout=8.0
            ) as client:
                resp = await client.get(url)
                resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "html.parser")
            text = _clean_html(soup)

            if _is_blocked_page(text):
                return ScrapingResult(
                    text="",
                    char_count=0,
                    method="requests",
                    success=False,
                    error="Le site bloque l'extraction automatique. Copiez-collez le texte de l'offre manuellement.",
                )

            if len(text.strip()) < 100:
                last_error = "Contenu insuffisant (site SPA probable)"
                continue  # retry once with the alt UA

            return ScrapingResult(
                text=text, char_count=len(text), method="requests", success=True,
            )
        except Exception as e:
            last_error = str(e)
            if attempt == 1:
                continue
            # Both attempts failed — fall through.

    return ScrapingResult(
        text="",
        char_count=0,
        method="requests",
        success=False,
        error=last_error or "httpx attempts failed",
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
    await _validate_url(url)
    url = _normalize_url(url)
    # Re-validate: normalization may change the host (e.g. LinkedIn collections → view).
    await _validate_url(url)

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
