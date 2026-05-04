from __future__ import annotations

from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from config_loader import load_settings
from models import Article
from processing.classifier import classify_article
from processing.scorer import score_market_relevance


class ScoringTests(unittest.TestCase):
    def test_article_gets_category_and_market_relevance_score(self) -> None:
        settings = load_settings(ROOT)
        article = Article(
            source_name="European Commission",
            source_level="L1",
            title="New SME grant, tax and import support call for Spain",
            url="https://example.com/grant",
            raw_summary="Convocatoria for pyme financing with fondos europeos, IVA compliance and import credit.",
        )

        category = classify_article(article, settings.keywords)
        score = score_market_relevance(article, settings.keywords, settings.scoring)

        self.assertEqual(category, "grants")
        self.assertGreaterEqual(score, 60)
        self.assertLessEqual(score, 100)


if __name__ == "__main__":
    unittest.main()
