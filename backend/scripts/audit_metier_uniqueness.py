"""Jaccard 8-gram overlap across rendered /cv-par-metier/* pages.

Ships the quality gate flagged by the SEO audit: the 20 programmatic metier
pages must stay substantially unique or Google penalises thin content.

Usage::

    python backend/scripts/audit_metier_uniqueness.py
    python backend/scripts/audit_metier_uniqueness.py --base https://cvmodifier.com
    python backend/scripts/audit_metier_uniqueness.py --base http://localhost:3000

Fails (exit 1) when any pair exceeds ``MAX_OVERLAP`` or any page is below
``MIN_WORDS`` of visible body text.
"""

from __future__ import annotations

import argparse
import itertools
import re
import sys
import urllib.request
from dataclasses import dataclass
from html.parser import HTMLParser
from typing import Iterable

# Force UTF-8 on Windows consoles (cp1252 chokes on box-drawing chars).
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]

# ──────────────────────────────────────────────────────────────────────
# Config
MAX_OVERLAP = 0.35  # fail if any pair > this
MIN_WORDS = 700     # fail if any page has fewer rendered words than this
NGRAM = 8           # Jaccard n-gram size (rolling 8-word window)

METIERS = [
    # Tech
    "developpeur-web", "data-analyst", "designer-ux-ui", "product-manager",
    "devops", "data-engineer", "sre-devops",
    # Commerce
    "commercial-b2b", "business-developer", "ingenieur-commercial",
    "account-manager", "responsable-commercial",
    # Marketing
    "charge-marketing-digital", "community-manager", "seo-manager",
    "brand-manager", "content-manager", "directeur-artistique",
    # RH
    "charge-recrutement", "customer-success", "hrbp",
    # Finance
    "comptable", "controleur-gestion", "auditeur-financier",
    # Santé
    "infirmier", "aide-soignant", "pharmacien-officine",
    # Management
    "chef-de-projet", "consultant", "scrum-master",
]

UA = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; CvModifierSEOAudit/1.0; "
        "+https://cvmodifier.com)"
    ),
}


# ──────────────────────────────────────────────────────────────────────
# HTML → text
class _TextExtractor(HTMLParser):
    """Strip script/style/nav/footer and emit only visible body text."""

    SKIP = {"script", "style", "noscript", "nav", "footer", "header"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._depth_skip = 0
        self._chunks: list[str] = []

    def handle_starttag(self, tag: str, attrs):  # type: ignore[override]
        if tag in self.SKIP:
            self._depth_skip += 1

    def handle_endtag(self, tag: str):  # type: ignore[override]
        if tag in self.SKIP and self._depth_skip > 0:
            self._depth_skip -= 1

    def handle_data(self, data: str):  # type: ignore[override]
        if self._depth_skip == 0:
            self._chunks.append(data)

    @property
    def text(self) -> str:
        return " ".join(self._chunks)


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as resp:  # noqa: S310
        raw = resp.read().decode("utf-8", errors="replace")
    parser = _TextExtractor()
    parser.feed(raw)
    return parser.text


def tokens(text: str) -> list[str]:
    return re.findall(r"\w+", text.lower(), flags=re.UNICODE)


def ngrams(words: list[str], n: int = NGRAM) -> set[tuple[str, ...]]:
    return {tuple(words[i : i + n]) for i in range(len(words) - n + 1)}


def jaccard(a: set, b: set) -> float:
    if not a and not b:
        return 0.0
    return len(a & b) / len(a | b)


# ──────────────────────────────────────────────────────────────────────
@dataclass
class PageStats:
    slug: str
    word_count: int
    grams: set[tuple[str, ...]]


def crawl(base: str, slugs: Iterable[str]) -> list[PageStats]:
    results: list[PageStats] = []
    for slug in slugs:
        url = f"{base.rstrip('/')}/cv-par-metier/{slug}"
        print(f"  fetch {url}")
        text = fetch_text(url)
        words = tokens(text)
        results.append(
            PageStats(slug=slug, word_count=len(words), grams=ngrams(words)),
        )
    return results


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="https://cvmodifier.com")
    parser.add_argument(
        "--max-overlap",
        type=float,
        default=MAX_OVERLAP,
        help=f"Fail threshold for Jaccard overlap (default {MAX_OVERLAP})",
    )
    parser.add_argument(
        "--min-words",
        type=int,
        default=MIN_WORDS,
        help=f"Fail threshold for word count (default {MIN_WORDS})",
    )
    args = parser.parse_args()

    print(f"Crawling {len(METIERS)} metier pages on {args.base}")
    pages = crawl(args.base, METIERS)

    print("\n── Word counts ──")
    short: list[PageStats] = []
    for p in sorted(pages, key=lambda x: x.word_count):
        flag = "THIN" if p.word_count < args.min_words else "ok"
        print(f"  {p.slug:<30} {p.word_count:>6} words  [{flag}]")
        if p.word_count < args.min_words:
            short.append(p)

    print("\n── Pairwise Jaccard (top overlaps) ──")
    pairs = []
    for a, b in itertools.combinations(pages, 2):
        overlap = jaccard(a.grams, b.grams)
        pairs.append((overlap, a.slug, b.slug))
    pairs.sort(reverse=True)

    for overlap, a, b in pairs[:15]:
        flag = "DUP " if overlap > args.max_overlap else "ok  "
        print(f"  [{flag}] {overlap:0.3f}  {a}  ↔  {b}")

    dups = [(o, a, b) for o, a, b in pairs if o > args.max_overlap]

    print("\n── Summary ──")
    print(f"  Pages < {args.min_words} words: {len(short)}")
    print(f"  Pairs > {args.max_overlap} Jaccard: {len(dups)}")

    if short or dups:
        print("\nFAIL — fix thin / duplicate content before scaling programmatic.")
        return 1

    print("\nPASS — all metier pages are uniquely sized and worded.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
