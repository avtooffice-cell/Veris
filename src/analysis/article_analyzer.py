from __future__ import annotations

from models import Article
from analysis.digest_generator import impact_summary
from utils.text import truncate


def generate_deep_dive(article: Article) -> str:
    summary = truncate(article.raw_summary or article.full_text or article.title, 450)
    uncertainty = "Інтерпретація потребує перевірки за першоджерелом." if article.source_level != "L1" else "Джерело є первинним або інституційним."
    return f"""🔎 Deep Dive: {truncate(article.title, 140)}

Джерело: {article.source_name}
Рівень: {article.source_level}
Релевантність: {article.market_relevance_score}/100

Що сталося:
{summary}

Чому це важливо:
{impact_summary(article)}

Вплив на наш ринок:
Матеріал варто оцінити через призму Іспанії, ЄС, імпорту, грантів, податків, фінансування, SME/autónomo та клієнтів-експатів.

Ризики:
{uncertainty}

Практичний висновок:
Не перебільшувати ефект до появи деталей, але підготувати коротке пояснення для клієнтів, якщо тема зачіпає їхні рішення.

Рекомендована дія:
Перевірити першоджерело, зберегти посилання і додати матеріал у клієнтський моніторинг.

Посилання:
{article.url}""".strip()
