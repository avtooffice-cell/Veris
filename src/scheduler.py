from __future__ import annotations

from datetime import datetime, time as time_type
import time
from typing import Callable

from config_loader import Settings


def _parse_time(value: str) -> time_type:
    hours, minutes = value.split(":", 1)
    return time_type(int(hours), int(minutes))


def in_quiet_hours(moment: datetime, start: str, end: str) -> bool:
    current = moment.time().replace(second=0, microsecond=0)
    quiet_start = _parse_time(start)
    quiet_end = _parse_time(end)
    if quiet_start <= quiet_end:
        return quiet_start <= current < quiet_end
    return current >= quiet_start or current < quiet_end


class IntervalScheduler:
    def __init__(
        self,
        settings: Settings,
        run_once: Callable[[], object],
        now_provider: Callable[[], datetime] | None = None,
        sleep_fn: Callable[[float], None] | None = None,
    ) -> None:
        self.settings = settings
        self.run_once = run_once
        self.now_provider = now_provider or datetime.now
        self.sleep_fn = sleep_fn or time.sleep

    def run_forever(self) -> None:
        digest_config = self.settings.schedule.get("jobs", {}).get("digest", {})
        interval_minutes = int(digest_config.get("interval_minutes", 180))
        quiet = digest_config.get("quiet_hours", {})
        while True:
            now = self.now_provider()
            if digest_config.get("enabled", True) and not in_quiet_hours(now, quiet.get("start", "22:00"), quiet.get("end", "07:00")):
                self.run_once()
            self.sleep_fn(max(60, interval_minutes * 60))
