from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, UTC
from hashlib import sha256
from typing import Any

from utils.text import normalize_text


@dataclass(slots=True)
class SourceConfig:
    name: str
    level: str
    type: str
    region: str = ""
    topics: list[str] = field(default_factory=list)
    rss: list[str] = field(default_factory=list)
    urls: list[str] = field(default_factory=list)


@dataclass(slots=True)
class Article:
    source_name: str
    source_level: str
    title: str
    url: str
    published_at: str | None = None
    fetched_at: str = field(default_factory=lambda: datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"))
    raw_summary: str = ""
    full_text: str = ""
    language: str = ""
    category: str = ""
    market_relevance_score: int = 0
    digest_included: bool = False
    deep_dive_included: bool = False
    content_hash: str = ""
    related_sources: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        if not self.content_hash:
            basis = f"{self.title}\n{self.raw_summary or self.full_text}\n{self.url}"
            self.content_hash = sha256(normalize_text(basis).encode("utf-8")).hexdigest()

    @property
    def normalized_title(self) -> str:
        return normalize_text(self.title)

    def to_dict(self) -> dict[str, Any]:
        return {
            "source_name": self.source_name,
            "source_level": self.source_level,
            "title": self.title,
            "url": self.url,
            "published_at": self.published_at,
            "fetched_at": self.fetched_at,
            "raw_summary": self.raw_summary,
            "full_text": self.full_text,
            "language": self.language,
            "category": self.category,
            "market_relevance_score": self.market_relevance_score,
            "digest_included": self.digest_included,
            "deep_dive_included": self.deep_dive_included,
            "content_hash": self.content_hash,
            "related_sources": self.related_sources,
        }


@dataclass(slots=True)
class PipelineResult:
    run_id: int | None
    fetched_count: int
    stored_count: int
    selected_count: int
    digest_sent: bool
    dry_run: bool
    digest_text: str
    deep_dive_texts: list[str]
    errors: list[str]

    def to_dict(self) -> dict[str, Any]:
        return {
            "run_id": self.run_id,
            "fetched_count": self.fetched_count,
            "stored_count": self.stored_count,
            "selected_count": self.selected_count,
            "digest_sent": self.digest_sent,
            "dry_run": self.dry_run,
            "digest_text": self.digest_text,
            "deep_dive_texts": self.deep_dive_texts,
            "errors": self.errors,
        }
