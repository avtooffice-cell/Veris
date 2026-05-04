from __future__ import annotations

from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from models import Article
from processing.deduplicator import deduplicate_articles


class DeduplicationTests(unittest.TestCase):
    def test_prefers_primary_source_and_keeps_related_sources(self) -> None:
        reuters = Article(
            source_name="Reuters",
            source_level="L2",
            title="Spain announces new SME tax reform",
            url="https://reuters.example/tax",
            market_relevance_score=80,
        )
        boe = Article(
            source_name="BOE",
            source_level="L1",
            title="Spain announces new SME tax reform",
            url="https://boe.example/tax",
            market_relevance_score=75,
        )

        unique = deduplicate_articles([reuters, boe])

        self.assertEqual(len(unique), 1)
        self.assertEqual(unique[0].source_name, "BOE")
        self.assertIn("Reuters", unique[0].related_sources)


if __name__ == "__main__":
    unittest.main()
