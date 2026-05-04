from __future__ import annotations

from email.utils import parsedate_to_datetime
import logging
from typing import Callable
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

from models import Article, SourceConfig
from utils.text import truncate

logger = logging.getLogger(__name__)
HttpGetter = Callable[[str, int, str], bytes]


def default_getter(url: str, timeout_seconds: int, user_agent: str) -> bytes:
    request = Request(url, headers={"User-Agent": user_agent})
    with urlopen(request, timeout=timeout_seconds) as response:
        return response.read()


def _local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1].lower()


def _text(element: ET.Element, names: set[str]) -> str:
    for child in list(element):
        if _local_name(child.tag) in names and child.text:
            return " ".join(child.text.split())
    return ""


def _link(entry: ET.Element) -> str:
    direct = _text(entry, {"link"})
    if direct:
        return direct
    for child in list(entry):
        if _local_name(child.tag) == "link" and child.attrib.get("href"):
            return child.attrib["href"]
    return ""


def _published(value: str) -> str | None:
    if not value:
        return None
    try:
        return parsedate_to_datetime(value).isoformat()
    except (TypeError, ValueError):
        return value


def parse_rss_or_atom(payload: bytes, source: SourceConfig, feed_url: str) -> list[Article]:
    root = ET.fromstring(payload)
    if _local_name(root.tag) == "rss":
        channel = next((child for child in list(root) if _local_name(child.tag) == "channel"), root)
        entries = [child for child in list(channel) if _local_name(child.tag) == "item"]
    else:
        entries = [child for child in list(root) if _local_name(child.tag) == "entry"]

    articles: list[Article] = []
    for entry in entries:
        title = _text(entry, {"title"})
        url = _link(entry)
        if not title or not url:
            continue
        summary = _text(entry, {"description", "summary", "content"})
        articles.append(
            Article(
                source_name=source.name,
                source_level=source.level,
                title=title,
                url=url,
                published_at=_published(_text(entry, {"pubdate", "published", "updated"})),
                raw_summary=truncate(summary, 1000),
            )
        )
    logger.info("Fetched %s RSS/Atom articles from %s", len(articles), feed_url)
    return articles


class RssFetcher:
    def __init__(self, timeout_seconds: int, user_agent: str, getter: HttpGetter | None = None) -> None:
        self.timeout_seconds = timeout_seconds
        self.user_agent = user_agent
        self.getter = getter or default_getter

    def fetch(self, source: SourceConfig) -> list[Article]:
        articles: list[Article] = []
        for feed_url in source.rss:
            if not feed_url:
                continue
            articles.extend(parse_rss_or_atom(self.getter(feed_url, self.timeout_seconds, self.user_agent), source, feed_url))
        return articles
