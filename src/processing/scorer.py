from __future__ import annotations

from models import Article
from utils.text import normalize_text


def score_market_relevance(article: Article, keywords: dict, scoring: dict) -> int:
    text = normalize_text(f"{article.title} {article.raw_summary} {article.full_text}")
    weights = scoring.get("market_relevance_weights", {})
    priority = keywords.get("priority_keywords", {})
    score = 0

    for category, weight in weights.items():
        terms = priority.get(category, [])
        if any(normalize_text(term) in text for term in terms):
            score += int(weight)

    market_hits = sum(1 for term in keywords.get("market_terms", []) if normalize_text(term) in text)
    if market_hits:
        score += min(10, market_hits * 2)

    level_bonus = {"L1": 8, "L2": 5, "L3": 3, "L4": 0}.get(article.source_level, 0)
    article.market_relevance_score = min(100, max(0, score + level_bonus))
    return article.market_relevance_score
