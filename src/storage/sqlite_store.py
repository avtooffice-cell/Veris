from __future__ import annotations

from datetime import datetime, UTC
import json
from pathlib import Path
import sqlite3

from models import Article


class SQLiteStore:
    def __init__(self, database_path: Path) -> None:
        self.database_path = database_path
        self.database_path.parent.mkdir(parents=True, exist_ok=True)

    def connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        return connection

    def initialize(self) -> None:
        schema_path = Path(__file__).with_name("schema.sql")
        connection = self.connect()
        try:
            connection.executescript(schema_path.read_text(encoding="utf-8"))
            connection.commit()
        finally:
            connection.close()

    def create_run(self) -> int:
        started_at = datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
        connection = self.connect()
        try:
            cursor = connection.execute(
                "INSERT INTO runs (started_at, status, articles_fetched, articles_selected, digest_sent) VALUES (?, ?, 0, 0, 0)",
                (started_at, "running"),
            )
            connection.commit()
            return int(cursor.lastrowid)
        finally:
            connection.close()

    def finish_run(self, run_id: int, status: str, articles_fetched: int, articles_selected: int, digest_sent: bool, error: str = "") -> None:
        finished_at = datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")
        connection = self.connect()
        try:
            connection.execute(
                """
                UPDATE runs
                SET finished_at = ?, status = ?, articles_fetched = ?, articles_selected = ?, digest_sent = ?, error = ?
                WHERE id = ?
                """,
                (finished_at, status, articles_fetched, articles_selected, int(digest_sent), error, run_id),
            )
            connection.commit()
        finally:
            connection.close()

    def existing_urls(self) -> set[str]:
        connection = self.connect()
        try:
            rows = connection.execute("SELECT url FROM articles").fetchall()
            return {str(row["url"]) for row in rows}
        finally:
            connection.close()

    def insert_articles(self, articles: list[Article]) -> int:
        inserted = 0
        connection = self.connect()
        try:
            for article in articles:
                cursor = connection.execute(
                    """
                    INSERT OR IGNORE INTO articles (
                        source_name, source_level, title, url, published_at, fetched_at, raw_summary,
                        full_text, language, category, market_relevance_score, digest_included,
                        deep_dive_included, content_hash, related_sources
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        article.source_name,
                        article.source_level,
                        article.title,
                        article.url,
                        article.published_at,
                        article.fetched_at,
                        article.raw_summary,
                        article.full_text,
                        article.language,
                        article.category,
                        article.market_relevance_score,
                        int(article.digest_included),
                        int(article.deep_dive_included),
                        article.content_hash,
                        json.dumps(article.related_sources, ensure_ascii=False),
                    ),
                )
                inserted += cursor.rowcount
            connection.commit()
        finally:
            connection.close()
        return inserted

    def mark_included(self, articles: list[Article], deep_dive_urls: set[str]) -> None:
        connection = self.connect()
        try:
            for article in articles:
                connection.execute(
                    "UPDATE articles SET digest_included = 1, deep_dive_included = ? WHERE url = ?",
                    (int(article.url in deep_dive_urls), article.url),
                )
            connection.commit()
        finally:
            connection.close()

    def recently_unpublished(self, minimum_score: int, limit: int = 20) -> list[Article]:
        connection = self.connect()
        try:
            rows = connection.execute(
                """
                SELECT * FROM articles
                WHERE digest_included = 0 AND market_relevance_score >= ?
                ORDER BY market_relevance_score DESC, fetched_at DESC
                LIMIT ?
                """,
                (minimum_score, limit),
            ).fetchall()
            return [self._row_to_article(row) for row in rows]
        finally:
            connection.close()

    @staticmethod
    def _row_to_article(row: sqlite3.Row) -> Article:
        return Article(
            source_name=row["source_name"],
            source_level=row["source_level"],
            title=row["title"],
            url=row["url"],
            published_at=row["published_at"],
            fetched_at=row["fetched_at"],
            raw_summary=row["raw_summary"] or "",
            full_text=row["full_text"] or "",
            language=row["language"] or "",
            category=row["category"] or "",
            market_relevance_score=int(row["market_relevance_score"] or 0),
            digest_included=bool(row["digest_included"]),
            deep_dive_included=bool(row["deep_dive_included"]),
            content_hash=row["content_hash"] or "",
            related_sources=json.loads(row["related_sources"] or "[]"),
        )
