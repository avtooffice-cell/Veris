from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from config_loader import load_settings
from pipeline import MarketIntelligencePipeline
from scheduler import IntervalScheduler
from telegram.publisher import TelegramPublisher
from utils.logging import configure_logging


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Market Intelligence Telegram Digest")
    parser.add_argument("--env-file", default=".env", help="Environment file relative to project root")
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("run-once", help="Fetch, score, store, and publish new digest items")
    subparsers.add_parser("dry-run", help="Run the full pipeline without Telegram publishing or DB writes")
    subparsers.add_parser("run-scheduler", help="Run interval scheduler")
    subparsers.add_parser("test-telegram", help="Send a test Telegram message")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    configure_logging()
    root = Path(__file__).resolve().parents[1]
    settings = load_settings(root, args.env_file)

    if args.command == "test-telegram":
        response = TelegramPublisher(settings.telegram_bot_token, settings.telegram_channel_id, settings.request_timeout_seconds).test_message()
        print(json.dumps(response, ensure_ascii=False, indent=2))
        return

    pipeline = MarketIntelligencePipeline(settings)
    if args.command == "dry-run":
        print(json.dumps(pipeline.run_once(dry_run=True).to_dict(), ensure_ascii=False, indent=2))
        return
    if args.command == "run-once":
        print(json.dumps(pipeline.run_once(dry_run=False).to_dict(), ensure_ascii=False, indent=2))
        return
    if args.command == "run-scheduler":
        IntervalScheduler(settings, lambda: pipeline.run_once(dry_run=False)).run_forever()
        return


if __name__ == "__main__":
    main()
