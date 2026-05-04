from __future__ import annotations

from datetime import date

from models import Article
from processing.grouper import group_by_category
from utils.text import truncate


ACTION_BY_CATEGORY = {
    "grants": "Перевірити, чи можна швидко підготувати клієнтів до нових заявок.",
    "tax": "Оновити чеклист податкових ризиків для клієнтів.",
    "trade": "Переглянути імпортні маршрути, мита та документи для активних клієнтів.",
    "finance": "Оцінити вплив на кредитування, ліквідність і вартість фінансування.",
    "sme": "Підготувати коротке пояснення для autónomo та малого бізнесу.",
    "expats": "Окремо пояснити наслідки для іноземних підприємців та експатів.",
}


def impact_summary(article: Article) -> str:
    category = article.category or "general"
    if category == "grants":
        return "може змінити доступність грантів, субсидій або державної допомоги."
    if category == "tax":
        return "може вплинути на податкове планування, IVA, IRPF або compliance."
    if category == "trade":
        return "може зачепити імпорт, мита, логістику або документи."
    if category == "finance":
        return "може вплинути на ставки, кредити, ліквідність або банківські умови."
    if category == "sme":
        return "важливо для малого бізнесу, pyme та autónomo."
    if category == "expats":
        return "може бути корисним для іноземних компаній та експатів в Іспанії."
    return "потребує перевірки практичного впливу перед дією."


def generate_digest(articles: list[Article]) -> str:
    if not articles:
        return "📊 Finance & Policy Digest\n\nСьогодні немає новин, які проходять поріг релевантності для публікації."

    lines = [f"📊 Finance & Policy Digest — {date.today().isoformat()}", ""]
    top_categories = ", ".join(sorted(group_by_category(articles).keys()))
    lines.append(f"Коротко: у фокусі {top_categories}. Найважливіше — відстежити практичний вплив на клієнтів в Іспанії, імпорт, гранти, податки та фінансування.")
    lines.append("")

    for index, article in enumerate(articles, start=1):
        lines.extend(
            [
                f"{index}. {truncate(article.title, 160)}",
                f"Джерело: {article.source_name} / {article.source_level}",
                f"Вплив: {impact_summary(article)}",
                f"Ринок: {article.market_relevance_score}/100",
                f"Посилання: {article.url}",
                "",
            ]
        )

    lines.extend(
        [
            "Висновок:",
            "Публікувати варто лише ті матеріали, де є прямий фінансовий, регуляторний або операційний наслідок. Інтерпретація потребує перевірки, якщо джерело не є первинним.",
            "",
            "Що робити:",
        ]
    )
    actions = []
    for article in articles:
        action = ACTION_BY_CATEGORY.get(article.category)
        if action and action not in actions:
            actions.append(action)
    lines.extend(f"- {action}" for action in (actions[:3] or ["Перевірити першоджерело перед клієнтською комунікацією."]))
    return "\n".join(lines).strip()
