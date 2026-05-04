from __future__ import annotations

from pathlib import Path
import tempfile
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from config_loader import load_settings
from models import Article
from pipeline import MarketIntelligencePipeline
from storage.sqlite_store import SQLiteStore


class FakeRssFetcher:
    def __init__(self) -> None:
        self.calls = 0

    def fetch(self, source):
        self.calls += 1
        return [
            Article(
                source_name=source.name,
                source_level=source.level,
                title="New grant and tax support for SME importers in Spain",
                url="https://example.com/article-1",
                raw_summary="Subvención, tax compliance, import financing and pyme support.",
            )
        ]


class FakeWebpageFetcher:
    def fetch(self, source):
        return []


class FakePublisher:
    def __init__(self) -> None:
        self.messages: list[str] = []

    def send_message(self, text: str):
        self.messages.append(text)
        return {"ok": True}


class PipelineTests(unittest.TestCase):
    def test_run_once_stores_and_does_not_republish_same_article(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            settings = load_settings(ROOT)
            settings.database_url = f"sqlite:///{Path(temp_dir) / 'market.db'}"
            settings.sources = [source for source in settings.sources if source.type == "rss"][:1]
            store = SQLiteStore(settings.database_path)
            publisher = FakePublisher()
            pipeline = MarketIntelligencePipeline(settings, store=store, publisher=publisher, rss_fetcher=FakeRssFetcher(), webpage_fetcher=FakeWebpageFetcher())

            first = pipeline.run_once(dry_run=False)
            second = pipeline.run_once(dry_run=False)

            self.assertEqual(first.stored_count, 1)
            self.assertEqual(first.selected_count, 1)
            self.assertTrue(first.digest_sent)
            self.assertEqual(second.stored_count, 0)
            self.assertEqual(second.selected_count, 0)
            self.assertEqual(len(publisher.messages), 2)

    def test_dry_run_does_not_publish_or_store(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            settings = load_settings(ROOT)
            settings.database_url = f"sqlite:///{Path(temp_dir) / 'market.db'}"
            settings.sources = [source for source in settings.sources if source.type == "rss"][:1]
            store = SQLiteStore(settings.database_path)
            publisher = FakePublisher()
            pipeline = MarketIntelligencePipeline(settings, store=store, publisher=publisher, rss_fetcher=FakeRssFetcher(), webpage_fetcher=FakeWebpageFetcher())

            result = pipeline.run_once(dry_run=True)

            self.assertEqual(result.stored_count, 0)
            self.assertIsNone(result.run_id)
            self.assertFalse(settings.database_path.exists())
            self.assertEqual(len(publisher.messages), 0)
            self.assertIn("Finance & Policy Digest", result.digest_text)


if __name__ == "__main__":
    unittest.main()
