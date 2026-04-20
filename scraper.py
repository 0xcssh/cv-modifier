import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup

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


def _get_session():
    session = requests.Session()
    retry = Retry(total=3, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    session.headers.update(HEADERS)
    return session


def _clean_html(soup: BeautifulSoup) -> str:
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "svg", "img"]):
        tag.decompose()

    # Try targeted selectors first
    for selector in ["article", "main", "[class*='job']", "[class*='description']", "[id*='job']"]:
        el = soup.select_one(selector)
        if el and len(el.get_text(strip=True)) > 100:
            return el.get_text(separator="\n", strip=True)[:MAX_TEXT_LENGTH]

    return soup.get_text(separator="\n", strip=True)[:MAX_TEXT_LENGTH]


def _scrape_with_playwright(url: str) -> str:
    """Fallback: use a headless browser to render JavaScript-heavy pages."""
    print("  [Playwright] Lancement du navigateur headless...")
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        # Wait a bit more for dynamic content
        page.wait_for_timeout(2000)
        html = page.content()
        browser.close()

    soup = BeautifulSoup(html, "html.parser")
    return _clean_html(soup)


def _ask_manual_input() -> str:
    print("\n[!] Impossible d'extraire le contenu de la page.")
    print("    Collez le texte de l'offre ci-dessous (terminez par une ligne vide) :\n")
    lines = []
    while True:
        line = input()
        if line == "":
            break
        lines.append(line)
    return "\n".join(lines)


def scrape_job_offer(url: str) -> str:
    # 1. Try requests first (fast)
    try:
        session = _get_session()
        resp = session.get(url, timeout=20)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        text = _clean_html(soup)
        if len(text.strip()) >= 100:
            return text
        print("  [!] Contenu insuffisant avec requests, tentative avec navigateur...")
    except Exception as e:
        print(f"  [!] Erreur requests : {e}")

    # 2. Fallback to Playwright (handles SPAs)
    try:
        text = _scrape_with_playwright(url)
        if len(text.strip()) >= 100:
            return text
        print("  [!] Contenu insuffisant même avec navigateur.")
    except Exception as e:
        print(f"  [!] Erreur Playwright : {e}")

    # 3. Last resort: manual input
    return _ask_manual_input()
