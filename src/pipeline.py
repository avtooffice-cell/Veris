from __future__ import annotations

import logging

from analysis.article_analyzer import generate_deep_dive
from analysis.digest_generator import generate_digest
from config_loader import Settings
from fetchers.institution_fetcher import InstitutionFetcher
from fetchers.rss_fetcher import RssFetcher
from fetchers.webpage_fetcher import WebpageFetcher
from models import Article, PipelineResult
from processing.classifier import classify_article
from processing.deduplicator import deduplicate_articles
from processing.normalizer import normalize_article
from processing.scorer import score_market_relevance
from storage.sqlite_store import SQLiteStore
from telegram.publisher import TelegramPublisher

logger = logging.getLogger(__name__)


class MarketIntelligencePipeline:
    def __init__(
        self,
        settings: Settings,
        store: SQLiteStore | None = None,
        publisher: TelegramPublisher | None = None,
        rss_fetcher: RssFetcher | None = None,
        webpage_fetcher: WebpageFetcher | None = None,
    ) -> None:
        self.settings = settings
        self.store = store or SQLiteStore(settings.database_path)
        self.publisher = publisher or TelegramPublisher(settings.telegram_bot_token, settings.telegram_channel_id, settings.request_timeout_seconds)
        self.rss_fetcher = rss_fetcher or RssFetcher(settings.request_timeout_seconds, settings.user_agent)
        self.webpage_fetcher = webpage_fetcher or WebpageFetcher(settings.request_timeout_seconds, settings.user_agent)
        self.institution_fetcher = InstitutionFetcher(self.webpage_fetcher)

    def fetch_articles(self) -> tuple[list[Article], list[str]]:
        articles: list[Article] = []
        errors: list[str] = []
        for source in self.settings.sources:
            try:
                if source.type == "rss":
                    articles.extend(self.rss_fetcher.fetch(source))
                elif source.type == "institution":
                    articles.extend(self.institution_fetcher.fetch(source))
                else:
                    articles.extend(self.webpage_fetcher.fetch(source))
            except Exception as error:
                logger.exception("Failed to fetch source %s", source.name)
                errors.append(f"{source.name}: {error}")
        return articles, errors

    def process_articles(self, articles: list[Article]) -> list[Article]:
        processed: list[Article] = []
        for article in articles:
            normalized = normalize_article(article)
            classify_article(normalized, self.settings.keywords)
            score_market_relevance(normalized, self.settings.keywords, self.settings.scoring)
            processed.append(normalized)
        return deduplicate_articles(processed)

    def run_once(self, dry_run: bool = False) -> PipelineResult:
        run_id: int | None = None
        if not dry_run:
            self.store.initialize()
            run_id = self.store.create_run()
        errors: list[str] = []
        try:
            fetched_articles, fetch_errors = self.fetch_articles()
            errors.extend(fetch_errors)
            unique_articles = self.process_articles(fetched_articles)
            existing_urls = set() if dry_run else self.store.existing_urls()
            new_articles = [article for article in unique_articles if article.url not in existing_urls]
            stored_count = 0 if dry_run else self.store.insert_articles(new_articles)

            minimum_digest_score = int(self.settings.scoring.get("minimum_digest_score", 60))
            if dry_run:
                candidates = [article for article in new_articles if article.market_relevance_score >= minimum_digest_score]
            else:
                candidates = self.store.recently_unpublished(minimum_digest_score)

            selected = candidates[:10]
            deep_dive_minimum = int(self.settings.scoring.get("minimum_deep_dive_score", 80))
            max_deep_dives = int(self.settings.scoring.get("max_deep_dive_articles", 3))
            deep_dive_articles = [article for article in selected if article.market_relevance_score >= deep_dive_minimum][:max_deep_dives]
            digest_text = generate_digest(selected)
            deep_dive_texts = [generate_deep_dive(article) for article in deep_dive_articles]

            digest_sent = False
            if not dry_run and selected:
                self.publisher.send_message(digest_text)
                for text in deep_dive_texts:
                    self.publisher.send_message(text)
                self.store.mark_included(selected, {article.url for article in deep_dive_articles})
                digest_sent = True

            if run_id is not None:
                self.store.finish_run(run_id, "success", len(fetched_articles), len(selected), digest_sent, "\n".join(errors))
            return PipelineResult(run_id, len(fetched_articles), stored_count, len(selected), digest_sent, dry_run, digest_text, deep_dive_texts, errors)
        except Exception as error:
            logger.exception("Pipeline run failed")
            errors.append(str(error))
            if run_id is not None:
                self.store.finish_run(run_id, "error", 0, 0, False, "\n".join(errors))
            return PipelineResult(run_id, 0, 0, 0, False, dry_run, "", [], errors)
