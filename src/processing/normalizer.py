from __future__ import annotations

from models import Article
from utils.text import normalize_text, truncate


def normalize_article(article: Article) -> Article:
    article.title = " ".join(article.title.split())
    article.raw_summary = truncate(article.raw_summary, 1000)
    article.full_text = truncate(article.full_text, 5000)
    article.language = article.language or detect_language(article.title + " " + article.raw_summary)
    return article


def detect_language(text: str) -> str:
    value = normalize_text(text)
    if any(token in value for token in (" el ", " la ", " para ", " españa", " autónomo")):
        return "es"
    if any(token in value for token in (" the ", " and ", " for ", " with ")):
        return "en"
    if any(token in value for token in (" є ", " для ", " та ", " ринок")):
        return "uk"
    return ""
