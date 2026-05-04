from __future__ import annotations

from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from analysis.article_analyzer import generate_deep_dive
from analysis.digest_generator import generate_digest
from models import Article


class DigestGenerationTests(unittest.TestCase):
    def test_digest_contains_ukrainian_market_commentary(self) -> None:
        article = Article(
            source_name="European Commission",
            source_level="L1",
            title="New grant call for SME digitalization",
            url="https://example.com/grants",
            raw_summary="Funding for small companies in Spain.",
            category="grants",
            market_relevance_score=88,
        )

        digest = generate_digest([article])

        self.assertIn("Коротко:", digest)
        self.assertIn("Висновок:", digest)
        self.assertIn("Що робити:", digest)
        self.assertIn("Ринок: 88/100", digest)

    def test_deep_dive_has_required_sections(self) -> None:
        article = Article(
            source_name="Reuters",
            source_level="L2",
            title="ECB signals credit tightening",
            url="https://example.com/ecb",
            raw_summary="Bank lending conditions may tighten.",
            category="finance",
            market_relevance_score=82,
        )

        deep_dive = generate_deep_dive(article)

        self.assertIn("Що сталося:", deep_dive)
        self.assertIn("Вплив на наш ринок:", deep_dive)
        self.assertIn("Рекомендована дія:", deep_dive)


if __name__ == "__main__":
    unittest.main()
