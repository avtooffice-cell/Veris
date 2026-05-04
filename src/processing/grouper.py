from __future__ import annotations

from collections import defaultdict

from models import Article


def group_by_category(articles: list[Article]) -> dict[str, list[Article]]:
    groups: dict[str, list[Article]] = defaultdict(list)
    for article in articles:
        groups[article.category or "general"].append(article)
    return dict(groups)
