from __future__ import annotations

import logging
from typing import Callable
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser
from urllib.request import Request, urlopen

from models import Article, SourceConfig
from utils.text import html_to_text, truncate

logger = logging.getLogger(__name__)
HttpTextGetter = Callable[[str, int, str], str]


def default_text_getter(url: str, timeout_seconds: int, user_agent: str) -> str:
    request = Request(url, headers={"User-Agent": user_agent})
    with urlopen(request, timeout=timeout_seconds) as response:
        return response.read().decode("utf-8", errors="replace")


def is_allowed_by_robots(url: str, user_agent: str) -> bool:
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    parser = RobotFileParser()
    parser.set_url(robots_url)
    try:
        parser.read()
    except Exception:
        return True
    return parser.can_fetch(user_agent, url)


def title_from_html(html: str, fallback: str) -> str:
    lower = html.lower()
    start = lower.find("<title")
    if start == -1:
        return fallback
    start = lower.find(">", start)
    end = lower.find("</title>", start)
    if start == -1 or end == -1:
        return fallback
    return " ".join(html[start + 1 : end].split()) or fallback


class WebpageFetcher:
    def __init__(self, timeout_seconds: int, user_agent: str, getter: HttpTextGetter | None = None) -> None:
        self.timeout_seconds = timeout_seconds
        self.user_agent = user_agent
        self.getter = getter or default_text_getter

    def fetch(self, source: SourceConfig) -> list[Article]:
        articles: list[Article] = []
        for url in source.urls:
            if not is_allowed_by_robots(url, self.user_agent):
                logger.warning("Skipping %s because robots.txt disallows fetching", url)
                continue
            html = self.getter(url, self.timeout_seconds, self.user_agent)
            text = html_to_text(html)
            articles.append(
                Article(
                    source_name=source.name,
                    source_level=source.level,
                    title=title_from_html(html, source.name),
                    url=url,
                    raw_summary=truncate(text, 1000),
                    full_text=truncate(text, 5000),
                )
            )
        return articles
