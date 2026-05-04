from __future__ import annotations

from difflib import SequenceMatcher

from models import Article


LEVEL_RANK = {"L1": 4, "L2": 3, "L3": 2, "L4": 1}


def _is_similar(left: Article, right: Article, threshold: float) -> bool:
    if left.url == right.url:
        return True
    if left.normalized_title == right.normalized_title:
        return True
    if left.content_hash == right.content_hash:
        return True
    return SequenceMatcher(None, left.normalized_title, right.normalized_title).ratio() > threshold


def _prefer(left: Article, right: Article) -> Article:
    left_rank = LEVEL_RANK.get(left.source_level, 0)
    right_rank = LEVEL_RANK.get(right.source_level, 0)
    if left_rank != right_rank:
        return left if left_rank > right_rank else right
    if left.market_relevance_score != right.market_relevance_score:
        return left if left.market_relevance_score >= right.market_relevance_score else right
    return left


def deduplicate_articles(articles: list[Article], similarity_threshold: float = 0.85) -> list[Article]:
    unique: list[Article] = []
    for article in articles:
        duplicate_index = next((index for index, existing in enumerate(unique) if _is_similar(existing, article, similarity_threshold)), None)
        if duplicate_index is None:
            unique.append(article)
            continue
        existing = unique[duplicate_index]
        preferred = _prefer(existing, article)
        related = sorted(set(existing.related_sources + article.related_sources + [existing.source_name, article.source_name]) - {preferred.source_name})
        preferred.related_sources = related
        unique[duplicate_index] = preferred
    return unique
