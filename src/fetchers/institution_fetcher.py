from __future__ import annotations

from fetchers.webpage_fetcher import WebpageFetcher
from models import Article, SourceConfig


class InstitutionFetcher:
    def __init__(self, webpage_fetcher: WebpageFetcher) -> None:
        self.webpage_fetcher = webpage_fetcher

    def fetch(self, source: SourceConfig) -> list[Article]:
        return self.webpage_fetcher.fetch(source)
