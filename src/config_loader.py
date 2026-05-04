from __future__ import annotations

from dataclasses import dataclass
import ast
import os
from pathlib import Path
from typing import Any

from models import SourceConfig


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def _scalar(value: str) -> Any:
    value = value.strip()
    if value in {"", "null", "None"}:
        return None
    if value in {"true", "True"}:
        return True
    if value in {"false", "False"}:
        return False
    if value.startswith("[") and value.endswith("]"):
        try:
            return ast.literal_eval(value)
        except (SyntaxError, ValueError):
            return []
    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
        return value[1:-1]
    try:
        return int(value)
    except ValueError:
        return value


def _minimal_yaml(path: Path) -> dict[str, Any]:
    root: dict[str, Any] = {}
    stack: list[tuple[int, Any]] = [(-1, root)]
    key_stack: list[tuple[int, str]] = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue
        indent = len(raw_line) - len(raw_line.lstrip(" "))
        line = raw_line.strip()
        while stack and indent <= stack[-1][0]:
            stack.pop()
        parent = stack[-1][1]
        if line.startswith("- "):
            item_text = line[2:].strip()
            if not isinstance(parent, list):
                raise ValueError(f"Unexpected list item in {path}: {line}")
            if ":" in item_text:
                key, value = item_text.split(":", 1)
                item: dict[str, Any] = {key.strip(): _scalar(value)}
                parent.append(item)
                stack.append((indent, item))
            else:
                parent.append(_scalar(item_text))
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value:
            parent[key] = _scalar(value)
            continue
        next_container: Any = []
        key_stack.append((indent, key))
        parent[key] = next_container
        stack.append((indent, next_container))
        if key in {"jobs", "digest", "deep_dive", "quiet_hours", "source_level_weights", "market_relevance_weights", "priority_keywords"}:
            parent[key] = {}
            stack[-1] = (indent, parent[key])
    return root


def load_yaml(path: Path) -> dict[str, Any]:
    try:
        import yaml  # type: ignore

        payload = yaml.safe_load(path.read_text(encoding="utf-8"))
        return payload or {}
    except ModuleNotFoundError:
        return _minimal_yaml(path)


@dataclass(slots=True)
class Settings:
    root: Path
    database_url: str
    telegram_bot_token: str
    telegram_channel_id: str
    request_timeout_seconds: int
    user_agent: str
    sources: list[SourceConfig]
    keywords: dict[str, Any]
    scoring: dict[str, Any]
    schedule: dict[str, Any]

    @property
    def database_path(self) -> Path:
        if self.database_url.startswith("sqlite:///"):
            value = self.database_url.removeprefix("sqlite:///")
        else:
            value = self.database_url
        path = Path(value)
        return path if path.is_absolute() else self.root / path


def load_settings(root: Path | None = None, env_file: str = ".env") -> Settings:
    project_root = root or Path(__file__).resolve().parents[1]
    load_env(project_root / env_file)
    sources_payload = load_yaml(project_root / "config" / "sources.yaml")
    sources = [SourceConfig(**item) for item in sources_payload.get("sources", [])]
    return Settings(
        root=project_root,
        database_url=os.getenv("DATABASE_URL", "sqlite:///market_intelligence.db"),
        telegram_bot_token=os.getenv("TELEGRAM_BOT_TOKEN", ""),
        telegram_channel_id=os.getenv("TELEGRAM_CHANNEL_ID", ""),
        request_timeout_seconds=int(os.getenv("REQUEST_TIMEOUT_SECONDS", "15")),
        user_agent=os.getenv("USER_AGENT", "MarketIntelligenceTelegram/1.0"),
        sources=sources,
        keywords=load_yaml(project_root / "config" / "keywords.yaml"),
        scoring=load_yaml(project_root / "config" / "scoring.yaml"),
        schedule=load_yaml(project_root / "config" / "schedule.yaml"),
    )
