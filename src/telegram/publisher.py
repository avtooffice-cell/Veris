from __future__ import annotations

import json
from typing import Callable
from urllib.request import Request, urlopen


TelegramPoster = Callable[[str, dict, int], dict]


def default_poster(url: str, payload: dict, timeout_seconds: int) -> dict:
    request = Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"}, method="POST")
    with urlopen(request, timeout=timeout_seconds) as response:
        return json.loads(response.read().decode("utf-8"))


class TelegramPublisher:
    def __init__(self, bot_token: str, channel_id: str, timeout_seconds: int = 15, poster: TelegramPoster | None = None) -> None:
        self.bot_token = bot_token
        self.channel_id = channel_id
        self.timeout_seconds = timeout_seconds
        self.poster = poster or default_poster

    def send_message(self, text: str) -> dict:
        if not self.bot_token or not self.channel_id:
            raise ValueError("TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID are required")
        url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"
        payload = {"chat_id": self.channel_id, "text": text, "disable_web_page_preview": False}
        response = self.poster(url, payload, self.timeout_seconds)
        if not response.get("ok", False):
            raise RuntimeError(f"Telegram API rejected message: {response}")
        return response

    def test_message(self) -> dict:
        return self.send_message("Market Intelligence Telegram: тестове повідомлення успішно сформовано.")
