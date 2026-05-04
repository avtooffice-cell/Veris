from __future__ import annotations

from models import Article
from utils.text import normalize_text


def classify_article(article: Article, keywords: dict) -> str:
    text = normalize_text(f"{article.title} {article.raw_summary} {article.full_text}")
    best_category = ""
    best_hits = 0
    for category, terms in keywords.get("priority_keywords", {}).items():
        hits = sum(1 for term in terms if normalize_text(term) in text)
        if hits > best_hits:
            best_category = category
            best_hits = hits
    if best_category:
        article.category = best_category
    elif article.source_level == "L1":
        article.category = "institution"
    else:
        article.category = "general"
    return article.category


def source_level_weight(article: Article, scoring: dict) -> int:
    return int(scoring.get("source_level_weights", {}).get(article.source_level, 1))
