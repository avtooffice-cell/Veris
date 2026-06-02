import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const translations = {
  uk: {
    nav: ["Як це працює", "Що перевіряємо", "Діагностика", "FAQ"],
    slogan: "Не сам. Не навмання.",
    cta: "Перевірити випадок",
    locale: "Аліканте, Валенсійська спільнота та Іспанія",
    h1: "Не подавайтеся на допомогу навмання.",
    lead:
      "Спершу перевірте, чи має ваш бізнес реальні варіанти субсидій, грантів або фінансування в Іспанії.",
    sub:
      "Veris аналізує вашу ситуацію і каже, які шляхи можуть мати сенс, а коли рухатись далі не варто.",
    proof: "Якщо реальних варіантів немає, ми скажемо прямо.",
    secondary: "Як це працює",
    cardTitle: "Autonomo у підготовці",
    cardMeta: "Цифровізація + обладнання, Аліканте",
    meters: ["Регіональна відповідність", "Документи", "Ризик відмови"],
    reviewTitle: "Потрібно перевірити",
    checkItems: ["Реєстрація або планова дата", "Бюджет інвестиції", "Код діяльності"],
    problemKicker: "Проблема",
    problemTitle: "Багато заявок починаються запізно, неправильно або без реальної відповідності.",
    problems: [
      ["Розкидані вимоги", "Правила, строки й умови змінюються залежно від програми, регіону і типу бізнесу."],
      ["Втрачений час", "Документи готуються тижнями, навіть коли базові умови не виконані."],
      ["Нечіткі обіцянки", "Потрібна чесна перевірка, а не загальні фрази про можливості."]
    ],
    diagnosticTitle: "Чесний фільтр перед паперовою роботою.",
    diagnosticText:
      "Veris Check дає першу оцінку профілю, можливих шляхів і стоп-факторів до того, як ви витратите час на повний пакет документів.",
    price: "29-49 EUR",
    stepsTitle: "Від широкого питання до конкретного наступного кроку.",
    steps: [
      "Ви заповнюєте коротку форму.",
      "Veris перевіряє профіль і локальний контекст.",
      "Ви отримуєте першу відповідь або діагностику.",
      "Ви бачите реальні варіанти, блокери або чітке ні."
    ],
    checksTitle: "Ми перевіряємо відповідність, вимоги і ризики.",
    checks: [
      "Субсидії, гранти і фінансування",
      "Вимоги за регіоном і програмою",
      "Готові або відсутні документи",
      "Ризики, строки і причини зупинитись"
    ],
    complianceTitle: "Ми не обіцяємо схвалення. Ми обіцяємо ясність.",
    compliance:
      "Остаточне рішення ухвалює державний орган, банк або програма. Veris надає діагностичну та консультаційну підтримку.",
    faqTitle: "Питання перед стартом.",
    faq: [
      ["Veris гарантує субсидію?", "Ні. Ми допомагаємо зрозуміти, чи є сенс рухатись далі."],
      ["Це підходить для autonomos?", "Так. Veris створений для autonomos, майбутніх autonomos і малого бізнесу."],
      ["Можна перевірити фінансування?", "Так. Ми дивимось субсидії, гранти, фінансування і стоп-фактори."]
    ],
    formTitle: "Почніть з ясної оцінки вашої ситуації.",
    time: "2 хвилини",
    fields: ["Ім'я", "Email або WhatsApp", "Місто / регіон", "Тип бізнесу", "Що хочете перевірити?"],
    submit: "Надіслати запит",
    finalTitle: "Почніть з ясної оцінки вашого випадку.",
    finalCopy: "Ви не самі. Ви не йдете навмання.",
    footer: "Veris допомагає перевірити реальні варіанти до підготовки документів.",
    contact: "Контакт: TODO"
  },
  en: {
    nav: ["How it works", "What we check", "Diagnostic", "FAQ"],
    slogan: "Not alone. Not in the dark.",
    cta: "Check your case",
    locale: "Alicante, Valencian Community and Spain",
    h1: "Do not apply in the dark.",
    lead: "First check whether your business has real options for subsidies, grants or financing in Spain.",
    sub: "Veris reviews your situation and tells you which paths may make sense, and when it is better to stop.",
    proof: "If there are no real options, we say it clearly.",
    secondary: "How it works",
    cardTitle: "Autonomo in preparation",
    cardMeta: "Digitalization + equipment, Alicante",
    meters: ["Regional fit", "Documents", "Refusal risk"],
    reviewTitle: "Needs review",
    checkItems: ["Registration or planned date", "Investment budget", "Activity code"],
    problemKicker: "Problem",
    problemTitle: "Many applications start late, incorrectly or without real fit.",
    problems: [
      ["Scattered requirements", "Rules, deadlines and conditions change by program, region and business type."],
      ["Lost time", "Documents can take weeks, even when basic conditions are not met."],
      ["Vague promises", "You need a clear check, not generic claims about opportunities."]
    ],
    diagnosticTitle: "An honest filter before paperwork.",
    diagnosticText:
      "Veris Check gives a first view of your profile, possible paths and stop factors before you spend time on a full file.",
    price: "29-49 EUR",
    stepsTitle: "From a broad question to a concrete next step.",
    steps: ["Short form.", "Profile and local context review.", "Initial answer or diagnostic.", "Real options, blockers or a clear no."],
    checksTitle: "We check fit, requirements and risks.",
    checks: ["Subsidies, grants and financing", "Regional and program requirements", "Ready or missing documents", "Risks, timing and stop reasons"],
    complianceTitle: "We do not promise approval. We promise clarity.",
    compliance: "The final decision is made by the public body, bank or program. Veris provides diagnostic and advisory support.",
    faqTitle: "Questions before starting.",
    faq: [
      ["Does Veris guarantee a subsidy?", "No. We help you understand whether it makes sense to continue."],
      ["Is it for autonomos?", "Yes. Veris is built for autonomos, future autonomos and small businesses."],
      ["Can financing be checked?", "Yes. We review subsidies, grants, financing and stop factors."]
    ],
    formTitle: "Start with a clear assessment of your situation.",
    time: "2 minutes",
    fields: ["Name", "Email or WhatsApp", "City / region", "Business type", "What do you want to check?"],
    submit: "Send request",
    finalTitle: "Start with a clear assessment of your case.",
    finalCopy: "Not alone. Not in the dark.",
    footer: "Veris helps check real options before document preparation.",
    contact: "Contact: TODO"
  }
};

Object.assign(translations, {
  es: {
    nav: ["Cómo funciona", "Qué revisamos", "Diagnóstico", "FAQ"],
    slogan: "No solo. No a ciegas.",
    cta: "Revisar mi caso",
    locale: "Alicante, Comunidad Valenciana y España",
    h1: "No solicites ayudas a ciegas.",
    lead: "Primero comprueba si tu negocio tiene opciones reales de subvenciones, ayudas o financiación en España.",
    sub: "Veris analiza tu situación y te dice qué caminos pueden tener sentido, y cuándo es mejor detenerse.",
    proof: "Si no hay opciones reales, lo diremos claramente.",
    secondary: "Cómo funciona",
    cardTitle: "Autónomo en preparación",
    cardMeta: "Digitalización + equipamiento, Alicante",
    meters: ["Encaje regional", "Documentos", "Riesgo de rechazo"],
    reviewTitle: "Requiere revisión",
    checkItems: ["Registro o fecha prevista", "Presupuesto de inversión", "Código de actividad"],
    problemKicker: "Problema",
    problemTitle: "Muchas solicitudes empiezan tarde, mal o sin encaje real.",
    problems: [
      ["Requisitos dispersos", "Las reglas, plazos y condiciones cambian según el programa, la región y el tipo de negocio."],
      ["Tiempo perdido", "Preparar documentos puede llevar semanas, incluso cuando no se cumplen las condiciones básicas."],
      ["Promesas vagas", "Necesitas una revisión clara, no frases genéricas sobre oportunidades."]
    ],
    diagnosticTitle: "Un filtro honesto antes del papeleo.",
    diagnosticText:
      "Veris Check ofrece una primera evaluación de tu perfil, posibles caminos y factores de bloqueo antes de dedicar tiempo a un expediente completo.",
    price: "29-49 EUR",
    stepsTitle: "De una pregunta amplia a un siguiente paso concreto.",
    steps: ["Formulario breve.", "Revisión del perfil y contexto local.", "Primera respuesta o diagnóstico.", "Opciones reales, bloqueos o un no claro."],
    checksTitle: "Revisamos encaje, requisitos y riesgos.",
    checks: ["Subvenciones, ayudas y financiación", "Requisitos regionales y del programa", "Documentos listos o pendientes", "Riesgos, plazos y motivos para parar"],
    complianceTitle: "No prometemos aprobación. Prometemos claridad.",
    compliance: "La decisión final la toma el organismo público, banco o programa. Veris ofrece apoyo diagnóstico y consultivo.",
    faqTitle: "Preguntas antes de empezar.",
    faq: [
      ["¿Veris garantiza una subvención?", "No. Ayudamos a entender si tiene sentido continuar."],
      ["¿Sirve para autónomos?", "Sí. Veris está pensado para autónomos, futuros autónomos y pequeñas empresas."],
      ["¿Se puede revisar financiación?", "Sí. Revisamos subvenciones, ayudas, financiación y factores de bloqueo."]
    ],
    formTitle: "Empieza con una evaluación clara de tu situación.",
    time: "2 minutos",
    fields: ["Nombre", "Email o WhatsApp", "Ciudad / región", "Tipo de negocio", "¿Qué quieres revisar?"],
    submit: "Enviar solicitud",
    finalTitle: "Empieza con una evaluación clara de tu caso.",
    finalCopy: "No estás solo. No vas a ciegas.",
    footer: "Veris ayuda a revisar opciones reales antes de preparar documentos.",
    contact: "Contacto: TODO"
  },
  fr: {
    nav: ["Fonctionnement", "Ce que nous vérifions", "Diagnostic", "FAQ"],
    slogan: "Pas seul. Pas à l'aveugle.",
    cta: "Vérifier mon cas",
    locale: "Alicante, Communauté valencienne et Espagne",
    h1: "Ne demandez pas une aide à l'aveugle.",
    lead: "Vérifiez d'abord si votre activité a de vraies options de subventions, aides ou financement en Espagne.",
    sub: "Veris analyse votre situation et indique quelles pistes peuvent avoir du sens, et quand il vaut mieux s'arrêter.",
    proof: "S'il n'y a pas d'options réelles, nous le dirons clairement.",
    secondary: "Fonctionnement",
    cardTitle: "Autónomo en préparation",
    cardMeta: "Numérisation + équipement, Alicante",
    meters: ["Adéquation régionale", "Documents", "Risque de refus"],
    reviewTitle: "À vérifier",
    checkItems: ["Enregistrement ou date prévue", "Budget d'investissement", "Code d'activité"],
    problemKicker: "Problème",
    problemTitle: "Beaucoup de demandes commencent tard, mal ou sans réelle adéquation.",
    problems: [
      ["Exigences dispersées", "Les règles, délais et conditions changent selon le programme, la région et le type d'activité."],
      ["Temps perdu", "Les documents peuvent prendre des semaines, même lorsque les conditions de base ne sont pas remplies."],
      ["Promesses floues", "Il faut une vérification claire, pas des phrases générales sur les opportunités."]
    ],
    diagnosticTitle: "Un filtre honnête avant la paperasse.",
    diagnosticText:
      "Veris Check donne une première évaluation du profil, des pistes possibles et des facteurs bloquants avant de consacrer du temps à un dossier complet.",
    price: "29-49 EUR",
    stepsTitle: "D'une question large à une prochaine étape concrète.",
    steps: ["Formulaire court.", "Analyse du profil et du contexte local.", "Première réponse ou diagnostic.", "Options réelles, blocages ou non clair."],
    checksTitle: "Nous vérifions l'adéquation, les exigences et les risques.",
    checks: ["Subventions, aides et financement", "Exigences régionales et du programme", "Documents prêts ou manquants", "Risques, délais et raisons de s'arrêter"],
    complianceTitle: "Nous ne promettons pas l'approbation. Nous promettons la clarté.",
    compliance: "La décision finale appartient à l'organisme public, à la banque ou au programme. Veris fournit un soutien de diagnostic et de conseil.",
    faqTitle: "Questions avant de commencer.",
    faq: [
      ["Veris garantit-il une subvention ?", "Non. Nous aidons à comprendre s'il est pertinent de continuer."],
      ["Est-ce adapté aux autónomos ?", "Oui. Veris est conçu pour les autónomos, futurs autónomos et petites entreprises."],
      ["Peut-on vérifier un financement ?", "Oui. Nous examinons subventions, aides, financement et facteurs bloquants."]
    ],
    formTitle: "Commencez par une évaluation claire de votre situation.",
    time: "2 minutes",
    fields: ["Nom", "Email ou WhatsApp", "Ville / région", "Type d'activité", "Que voulez-vous vérifier ?"],
    submit: "Envoyer la demande",
    finalTitle: "Commencez par une évaluation claire de votre cas.",
    finalCopy: "Pas seul. Pas à l'aveugle.",
    footer: "Veris aide à vérifier les options réelles avant de préparer les documents.",
    contact: "Contact : TODO"
  },
  de: {
    nav: ["So funktioniert es", "Was wir prüfen", "Diagnose", "FAQ"],
    slogan: "Nicht allein. Nicht im Dunkeln.",
    cta: "Fall prüfen",
    locale: "Alicante, Valencianische Gemeinschaft und Spanien",
    h1: "Beantragen Sie keine Förderung im Blindflug.",
    lead: "Prüfen Sie zuerst, ob Ihr Unternehmen echte Optionen für Zuschüsse, Fördermittel oder Finanzierung in Spanien hat.",
    sub: "Veris analysiert Ihre Situation und sagt, welche Wege sinnvoll sein können und wann es besser ist, nicht weiterzumachen.",
    proof: "Wenn es keine realistischen Optionen gibt, sagen wir das klar.",
    secondary: "So funktioniert es",
    cardTitle: "Autónomo in Vorbereitung",
    cardMeta: "Digitalisierung + Ausstattung, Alicante",
    meters: ["Regionale Passung", "Dokumente", "Ablehnungsrisiko"],
    reviewTitle: "Zu prüfen",
    checkItems: ["Registrierung oder geplantes Datum", "Investitionsbudget", "Tätigkeitscode"],
    problemKicker: "Problem",
    problemTitle: "Viele Anträge starten zu spät, falsch oder ohne echte Passung.",
    problems: [
      ["Verstreute Anforderungen", "Regeln, Fristen und Bedingungen ändern sich je nach Programm, Region und Unternehmenstyp."],
      ["Verlorene Zeit", "Dokumente können Wochen dauern, selbst wenn Grundbedingungen nicht erfüllt sind."],
      ["Unklare Versprechen", "Sie brauchen eine ehrliche Prüfung, keine allgemeinen Aussagen über Chancen."]
    ],
    diagnosticTitle: "Ein ehrlicher Filter vor der Papierarbeit.",
    diagnosticText:
      "Veris Check gibt eine erste Einschätzung von Profil, möglichen Wegen und Stop-Faktoren, bevor Sie Zeit in vollständige Unterlagen investieren.",
    price: "29-49 EUR",
    stepsTitle: "Von einer breiten Frage zum konkreten nächsten Schritt.",
    steps: ["Kurzes Formular.", "Prüfung von Profil und lokalem Kontext.", "Erste Antwort oder Diagnose.", "Reale Optionen, Blocker oder ein klares Nein."],
    checksTitle: "Wir prüfen Passung, Anforderungen und Risiken.",
    checks: ["Zuschüsse, Fördermittel und Finanzierung", "Regionale und programmspezifische Anforderungen", "Vorhandene oder fehlende Dokumente", "Risiken, Fristen und Stop-Gründe"],
    complianceTitle: "Wir versprechen keine Genehmigung. Wir versprechen Klarheit.",
    compliance: "Die endgültige Entscheidung trifft die öffentliche Stelle, Bank oder das Programm. Veris bietet diagnostische und beratende Unterstützung.",
    faqTitle: "Fragen vor dem Start.",
    faq: [
      ["Garantiert Veris eine Förderung?", "Nein. Wir helfen zu verstehen, ob es sinnvoll ist, weiterzumachen."],
      ["Ist das für Autónomos geeignet?", "Ja. Veris ist für Autónomos, zukünftige Autónomos und kleine Unternehmen gedacht."],
      ["Kann Finanzierung geprüft werden?", "Ja. Wir prüfen Zuschüsse, Fördermittel, Finanzierung und Stop-Faktoren."]
    ],
    formTitle: "Beginnen Sie mit einer klaren Einschätzung Ihrer Situation.",
    time: "2 Minuten",
    fields: ["Name", "Email oder WhatsApp", "Stadt / Region", "Unternehmenstyp", "Was möchten Sie prüfen?"],
    submit: "Anfrage senden",
    finalTitle: "Beginnen Sie mit einer klaren Einschätzung Ihres Falls.",
    finalCopy: "Nicht allein. Nicht im Dunkeln.",
    footer: "Veris hilft, reale Optionen vor der Dokumentenvorbereitung zu prüfen.",
    contact: "Kontakt: TODO"
  },
  pl: {
    nav: ["Jak to działa", "Co sprawdzamy", "Diagnoza", "FAQ"],
    slogan: "Nie sam. Nie na ślepo.",
    cta: "Sprawdź przypadek",
    locale: "Alicante, Wspólnota Walencka i Hiszpania",
    h1: "Nie składaj wniosku o pomoc na ślepo.",
    lead: "Najpierw sprawdź, czy Twoja firma ma realne opcje dotacji, grantów lub finansowania w Hiszpanii.",
    sub: "Veris analizuje Twoją sytuację i mówi, które ścieżki mogą mieć sens, a kiedy lepiej się zatrzymać.",
    proof: "Jeśli nie ma realnych opcji, powiemy to wprost.",
    secondary: "Jak to działa",
    cardTitle: "Autónomo w przygotowaniu",
    cardMeta: "Cyfryzacja + wyposażenie, Alicante",
    meters: ["Dopasowanie regionalne", "Dokumenty", "Ryzyko odmowy"],
    reviewTitle: "Do sprawdzenia",
    checkItems: ["Rejestracja lub planowana data", "Budżet inwestycji", "Kod działalności"],
    problemKicker: "Problem",
    problemTitle: "Wiele wniosków zaczyna się za późno, błędnie albo bez realnego dopasowania.",
    problems: [
      ["Rozproszone wymagania", "Zasady, terminy i warunki zmieniają się zależnie od programu, regionu i typu firmy."],
      ["Stracony czas", "Dokumenty mogą zająć tygodnie, nawet gdy podstawowe warunki nie są spełnione."],
      ["Niejasne obietnice", "Potrzebujesz rzetelnej weryfikacji, nie ogólnych haseł o możliwościach."]
    ],
    diagnosticTitle: "Uczciwy filtr przed papierologią.",
    diagnosticText:
      "Veris Check daje pierwszą ocenę profilu, możliwych ścieżek i czynników blokujących, zanim poświęcisz czas na pełny pakiet dokumentów.",
    price: "29-49 EUR",
    stepsTitle: "Od szerokiego pytania do konkretnego następnego kroku.",
    steps: ["Krótki formularz.", "Analiza profilu i lokalnego kontekstu.", "Pierwsza odpowiedź lub diagnoza.", "Realne opcje, blokady albo jasne nie."],
    checksTitle: "Sprawdzamy dopasowanie, wymagania i ryzyka.",
    checks: ["Dotacje, granty i finansowanie", "Wymagania regionalne i programowe", "Gotowe lub brakujące dokumenty", "Ryzyka, terminy i powody, by się zatrzymać"],
    complianceTitle: "Nie obiecujemy zatwierdzenia. Obiecujemy jasność.",
    compliance: "Ostateczną decyzję podejmuje instytucja publiczna, bank lub program. Veris zapewnia wsparcie diagnostyczne i doradcze.",
    faqTitle: "Pytania przed startem.",
    faq: [
      ["Czy Veris gwarantuje dotację?", "Nie. Pomagamy zrozumieć, czy warto iść dalej."],
      ["Czy to jest dla autónomos?", "Tak. Veris jest dla autónomos, przyszłych autónomos i małych firm."],
      ["Czy można sprawdzić finansowanie?", "Tak. Sprawdzamy dotacje, granty, finansowanie i czynniki blokujące."]
    ],
    formTitle: "Zacznij od jasnej oceny swojej sytuacji.",
    time: "2 minuty",
    fields: ["Imię", "Email lub WhatsApp", "Miasto / region", "Typ firmy", "Co chcesz sprawdzić?"],
    submit: "Wyślij zapytanie",
    finalTitle: "Zacznij od jasnej oceny swojego przypadku.",
    finalCopy: "Nie sam. Nie na ślepo.",
    footer: "Veris pomaga sprawdzić realne opcje przed przygotowaniem dokumentów.",
    contact: "Kontakt: TODO"
  },
  ru: {
    nav: ["Как это работает", "Что проверяем", "Диагностика", "FAQ"],
    slogan: "Не один. Не вслепую.",
    cta: "Проверить случай",
    locale: "Аликанте, Валенсийское сообщество и Испания",
    h1: "Не подавайте заявку на помощь вслепую.",
    lead: "Сначала проверьте, есть ли у вашего бизнеса реальные варианты субсидий, грантов или финансирования в Испании.",
    sub: "Veris анализирует вашу ситуацию и говорит, какие пути могут иметь смысл, а когда лучше остановиться.",
    proof: "Если реальных вариантов нет, мы скажем прямо.",
    secondary: "Как это работает",
    cardTitle: "Autónomo в подготовке",
    cardMeta: "Цифровизация + оборудование, Аликанте",
    meters: ["Региональное соответствие", "Документы", "Риск отказа"],
    reviewTitle: "Нужно проверить",
    checkItems: ["Регистрация или плановая дата", "Бюджет инвестиции", "Код деятельности"],
    problemKicker: "Проблема",
    problemTitle: "Многие заявки начинаются поздно, неправильно или без реального соответствия.",
    problems: [
      ["Разрозненные требования", "Правила, сроки и условия меняются в зависимости от программы, региона и типа бизнеса."],
      ["Потерянное время", "Подготовка документов может занять недели, даже когда базовые условия не выполнены."],
      ["Нечеткие обещания", "Нужна честная проверка, а не общие фразы о возможностях."]
    ],
    diagnosticTitle: "Честный фильтр перед бумажной работой.",
    diagnosticText:
      "Veris Check дает первую оценку профиля, возможных путей и стоп-факторов до того, как вы потратите время на полный пакет документов.",
    price: "29-49 EUR",
    stepsTitle: "От широкого вопроса к конкретному следующему шагу.",
    steps: ["Короткая форма.", "Проверка профиля и локального контекста.", "Первый ответ или диагностика.", "Реальные варианты, блокеры или четкое нет."],
    checksTitle: "Мы проверяем соответствие, требования и риски.",
    checks: ["Субсидии, гранты и финансирование", "Региональные и программные требования", "Готовые или отсутствующие документы", "Риски, сроки и причины остановиться"],
    complianceTitle: "Мы не обещаем одобрение. Мы обещаем ясность.",
    compliance: "Окончательное решение принимает государственный орган, банк или программа. Veris оказывает диагностическую и консультационную поддержку.",
    faqTitle: "Вопросы перед стартом.",
    faq: [
      ["Veris гарантирует субсидию?", "Нет. Мы помогаем понять, есть ли смысл двигаться дальше."],
      ["Это подходит для autonomos?", "Да. Veris создан для autonomos, будущих autonomos и малого бизнеса."],
      ["Можно проверить финансирование?", "Да. Мы смотрим субсидии, гранты, финансирование и стоп-факторы."]
    ],
    formTitle: "Начните с ясной оценки вашей ситуации.",
    time: "2 минуты",
    fields: ["Имя", "Email или WhatsApp", "Город / регион", "Тип бизнеса", "Что хотите проверить?"],
    submit: "Отправить запрос",
    finalTitle: "Начните с ясной оценки вашего случая.",
    finalCopy: "Не один. Не вслепую.",
    footer: "Veris помогает проверить реальные варианты до подготовки документов.",
    contact: "Контакт: TODO"
  }
});

const languageOrder = ["en", "es", "fr", "de", "pl", "ru", "uk"];

const languageLabels = {
  en: "EN",
  es: "ES",
  fr: "FR",
  de: "DE",
  pl: "PL",
  ru: "RU",
  uk: "UA"
};

const questionnaireTranslations = {
  uk: {
    clearStep: "Зрозумілий наступний крок",
    title: "Заповнити анкету перевірки",
    meta: "6 блоків питань · без обіцянок схвалення",
    open: "Відкрити анкету",
    close: "Закрити анкету",
    groups: ["Профіль бізнесу", "Параметри запиту", "Контакт і деталі"],
    selects: [
      ["Ситуація", ["Оберіть варіант", "Я вже autonomo", "Планую стати autonomo", "Маю малий бізнес", "Хочу перевірити ідею"]],
      ["Вік бізнесу", ["Оберіть варіант", "Ще не зареєстрований", "До 6 місяців", "6-24 місяці", "Більше 2 років"]],
      ["Орієнтовна сума", ["Оберіть варіант", "До 3 000 EUR", "3 000-10 000 EUR", "10 000-30 000 EUR", "Понад 30 000 EUR"]],
      ["Для чого потрібна підтримка?", ["Оберіть варіант", "Обладнання", "Цифровізація", "Запуск бізнесу", "Оборотні кошти", "Інше"]],
      ["Інвестиція", ["Оберіть варіант", "Планується", "Вже зроблена", "Частково зроблена", "Поки не знаю"]],
      ["Бажаний контакт", ["Оберіть варіант", "Email", "WhatsApp", "Телефон"]]
    ],
    textFields: [
      ["Місто і регіон", "Напр. Аліканте, Валенсійська спільнота"],
      ["Сектор або діяльність", "Напр. торгівля, horeca, послуги..."],
      ["Контакт", "Email або телефон"],
      ["Конкретна програма, якщо вже є", "Необов'язково"]
    ],
    notesLabel: "Щось важливе про ваш випадок",
    optional: "Необов'язково",
    consent: "Я погоджуюсь, щоб Veris розглянув цю інформацію для відповіді щодо мого випадку. TODO: додати реальну політику приватності.",
    submit: "Надіслати на перевірку"
  },
  en: {
    clearStep: "Clear next step",
    title: "Fill in the check questionnaire",
    meta: "6 question blocks · no approval promises",
    open: "Open questionnaire",
    close: "Close questionnaire",
    groups: ["Business profile", "Request parameters", "Contact and details"],
    selects: [
      ["Situation", ["Choose an option", "I am already autonomo", "I plan to become autonomo", "I have a small business", "I want to check an idea"]],
      ["Business age", ["Choose an option", "Not registered yet", "Up to 6 months", "6-24 months", "More than 2 years"]],
      ["Estimated amount", ["Choose an option", "Up to 3,000 EUR", "3,000-10,000 EUR", "10,000-30,000 EUR", "More than 30,000 EUR"]],
      ["What support is needed for?", ["Choose an option", "Equipment", "Digitalization", "Business launch", "Working capital", "Other"]],
      ["Investment", ["Choose an option", "Planned", "Already made", "Partly made", "Not sure yet"]],
      ["Preferred contact", ["Choose an option", "Email", "WhatsApp", "Phone"]]
    ],
    textFields: [["City and region", "E.g. Alicante, Valencian Community"], ["Sector or activity", "E.g. retail, horeca, services..."], ["Contact", "Email or phone"], ["Specific program, if any", "Optional"]],
    notesLabel: "Anything important about your case",
    optional: "Optional",
    consent: "I agree that Veris may review this information to respond about my case. TODO: add a real privacy policy.",
    submit: "Send for review"
  },
  es: {
    clearStep: "Siguiente paso claro",
    title: "Rellenar el cuestionario",
    meta: "6 bloques de preguntas · sin promesas de aprobación",
    open: "Abrir cuestionario",
    close: "Cerrar cuestionario",
    groups: ["Perfil del negocio", "Parámetros de la solicitud", "Contacto y detalles"],
    selects: [
      ["Situación", ["Elige una opción", "Ya soy autónomo", "Planeo ser autónomo", "Tengo una pequeña empresa", "Quiero revisar una idea"]],
      ["Antigüedad del negocio", ["Elige una opción", "Aún no registrado", "Hasta 6 meses", "6-24 meses", "Más de 2 años"]],
      ["Importe estimado", ["Elige una opción", "Hasta 3.000 EUR", "3.000-10.000 EUR", "10.000-30.000 EUR", "Más de 30.000 EUR"]],
      ["¿Para qué necesitas apoyo?", ["Elige una opción", "Equipamiento", "Digitalización", "Inicio del negocio", "Capital circulante", "Otro"]],
      ["Inversión", ["Elige una opción", "Planificada", "Ya realizada", "Realizada parcialmente", "Aún no lo sé"]],
      ["Contacto preferido", ["Elige una opción", "Email", "WhatsApp", "Teléfono"]]
    ],
    textFields: [["Ciudad y región", "Ej. Alicante, Comunidad Valenciana"], ["Sector o actividad", "Ej. comercio, horeca, servicios..."], ["Contacto", "Email o teléfono"], ["Programa concreto, si ya existe", "Opcional"]],
    notesLabel: "Algo importante sobre tu caso",
    optional: "Opcional",
    consent: "Acepto que Veris revise esta información para responder sobre mi caso. TODO: añadir una política de privacidad real.",
    submit: "Enviar para revisión"
  },
  fr: {
    clearStep: "Prochaine étape claire",
    title: "Remplir le questionnaire",
    meta: "6 blocs de questions · aucune promesse d'approbation",
    open: "Ouvrir le questionnaire",
    close: "Fermer le questionnaire",
    groups: ["Profil de l'activité", "Paramètres de la demande", "Contact et détails"],
    selects: [
      ["Situation", ["Choisir une option", "Je suis déjà autónomo", "Je prévois de devenir autónomo", "J'ai une petite entreprise", "Je veux vérifier une idée"]],
      ["Âge de l'activité", ["Choisir une option", "Pas encore enregistrée", "Jusqu'à 6 mois", "6-24 mois", "Plus de 2 ans"]],
      ["Montant estimé", ["Choisir une option", "Jusqu'à 3 000 EUR", "3 000-10 000 EUR", "10 000-30 000 EUR", "Plus de 30 000 EUR"]],
      ["Pourquoi avez-vous besoin d'aide ?", ["Choisir une option", "Équipement", "Numérisation", "Lancement d'activité", "Fonds de roulement", "Autre"]],
      ["Investissement", ["Choisir une option", "Prévu", "Déjà réalisé", "Partiellement réalisé", "Pas encore sûr"]],
      ["Contact préféré", ["Choisir une option", "Email", "WhatsApp", "Téléphone"]]
    ],
    textFields: [["Ville et région", "Ex. Alicante, Communauté valencienne"], ["Secteur ou activité", "Ex. commerce, horeca, services..."], ["Contact", "Email ou téléphone"], ["Programme précis, s'il existe", "Optionnel"]],
    notesLabel: "Quelque chose d'important sur votre cas",
    optional: "Optionnel",
    consent: "J'accepte que Veris examine ces informations pour répondre à propos de mon cas. TODO : ajouter une vraie politique de confidentialité.",
    submit: "Envoyer pour vérification"
  },
  de: {
    clearStep: "Klarer nächster Schritt",
    title: "Prüffragebogen ausfüllen",
    meta: "6 Frageblöcke · keine Genehmigungsversprechen",
    open: "Fragebogen öffnen",
    close: "Fragebogen schließen",
    groups: ["Geschäftsprofil", "Anfrageparameter", "Kontakt und Details"],
    selects: [
      ["Situation", ["Option wählen", "Ich bin bereits autónomo", "Ich plane autónomo zu werden", "Ich habe ein kleines Unternehmen", "Ich möchte eine Idee prüfen"]],
      ["Alter des Unternehmens", ["Option wählen", "Noch nicht registriert", "Bis 6 Monate", "6-24 Monate", "Mehr als 2 Jahre"]],
      ["Geschätzter Betrag", ["Option wählen", "Bis 3.000 EUR", "3.000-10.000 EUR", "10.000-30.000 EUR", "Mehr als 30.000 EUR"]],
      ["Wofür wird Unterstützung benötigt?", ["Option wählen", "Ausstattung", "Digitalisierung", "Geschäftsstart", "Betriebskapital", "Sonstiges"]],
      ["Investition", ["Option wählen", "Geplant", "Bereits getätigt", "Teilweise getätigt", "Noch unsicher"]],
      ["Bevorzugter Kontakt", ["Option wählen", "Email", "WhatsApp", "Telefon"]]
    ],
    textFields: [["Stadt und Region", "Z. B. Alicante, Valencianische Gemeinschaft"], ["Branche oder Tätigkeit", "Z. B. Handel, Horeca, Dienstleistungen..."], ["Kontakt", "Email oder Telefon"], ["Konkretes Programm, falls vorhanden", "Optional"]],
    notesLabel: "Etwas Wichtiges zu Ihrem Fall",
    optional: "Optional",
    consent: "Ich stimme zu, dass Veris diese Informationen prüft, um zu meinem Fall zu antworten. TODO: echte Datenschutzerklärung hinzufügen.",
    submit: "Zur Prüfung senden"
  },
  pl: {
    clearStep: "Jasny następny krok",
    title: "Wypełnij ankietę weryfikacyjną",
    meta: "6 bloków pytań · bez obietnic zatwierdzenia",
    open: "Otwórz ankietę",
    close: "Zamknij ankietę",
    groups: ["Profil firmy", "Parametry zapytania", "Kontakt i szczegóły"],
    selects: [
      ["Sytuacja", ["Wybierz opcję", "Jestem już autónomo", "Planuję zostać autónomo", "Mam małą firmę", "Chcę sprawdzić pomysł"]],
      ["Wiek firmy", ["Wybierz opcję", "Jeszcze niezarejestrowana", "Do 6 miesięcy", "6-24 miesiące", "Ponad 2 lata"]],
      ["Szacowana kwota", ["Wybierz opcję", "Do 3 000 EUR", "3 000-10 000 EUR", "10 000-30 000 EUR", "Ponad 30 000 EUR"]],
      ["Na co potrzebne jest wsparcie?", ["Wybierz opcję", "Wyposażenie", "Cyfryzacja", "Start firmy", "Kapitał obrotowy", "Inne"]],
      ["Inwestycja", ["Wybierz opcję", "Planowana", "Już wykonana", "Częściowo wykonana", "Jeszcze nie wiem"]],
      ["Preferowany kontakt", ["Wybierz opcję", "Email", "WhatsApp", "Telefon"]]
    ],
    textFields: [["Miasto i region", "Np. Alicante, Wspólnota Walencka"], ["Sektor lub działalność", "Np. handel, horeca, usługi..."], ["Kontakt", "Email lub telefon"], ["Konkretny program, jeśli już jest", "Opcjonalnie"]],
    notesLabel: "Coś ważnego o Twoim przypadku",
    optional: "Opcjonalnie",
    consent: "Zgadzam się, aby Veris przeanalizował te informacje w celu odpowiedzi dotyczącej mojego przypadku. TODO: dodać prawdziwą politykę prywatności.",
    submit: "Wyślij do sprawdzenia"
  },
  ru: {
    clearStep: "Понятный следующий шаг",
    title: "Заполнить анкету проверки",
    meta: "6 блоков вопросов · без обещаний одобрения",
    open: "Открыть анкету",
    close: "Закрыть анкету",
    groups: ["Профиль бизнеса", "Параметры запроса", "Контакт и детали"],
    selects: [
      ["Ситуация", ["Выберите вариант", "Я уже autonomo", "Планирую стать autonomo", "У меня малый бизнес", "Хочу проверить идею"]],
      ["Возраст бизнеса", ["Выберите вариант", "Еще не зарегистрирован", "До 6 месяцев", "6-24 месяца", "Более 2 лет"]],
      ["Ориентировочная сумма", ["Выберите вариант", "До 3 000 EUR", "3 000-10 000 EUR", "10 000-30 000 EUR", "Более 30 000 EUR"]],
      ["Для чего нужна поддержка?", ["Выберите вариант", "Оборудование", "Цифровизация", "Запуск бизнеса", "Оборотные средства", "Другое"]],
      ["Инвестиция", ["Выберите вариант", "Планируется", "Уже сделана", "Частично сделана", "Пока не знаю"]],
      ["Желаемый контакт", ["Выберите вариант", "Email", "WhatsApp", "Телефон"]]
    ],
    textFields: [["Город и регион", "Напр. Аликанте, Валенсийское сообщество"], ["Сектор или деятельность", "Напр. торговля, horeca, услуги..."], ["Контакт", "Email или телефон"], ["Конкретная программа, если уже есть", "Необязательно"]],
    notesLabel: "Что-то важное о вашем случае",
    optional: "Необязательно",
    consent: "Я соглашаюсь, чтобы Veris рассмотрел эту информацию для ответа по моему случаю. TODO: добавить реальную политику приватности.",
    submit: "Отправить на проверку"
  }
};

function App() {
  const [lang, setLang] = useState("uk");
  const t = translations[lang];
  const q = questionnaireTranslations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <>
      <header className="site-header" id="top">
        <a className="brand" href="#top" aria-label="Veris home">
          <img className="brand-logo" src="/veris-full-logo.png" alt="Veris" />
          <span className="brand-slogan">{t.slogan}</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#how">{t.nav[0]}</a>
          <a href="#checks">{t.nav[1]}</a>
          <a href="#diagnostic">{t.nav[2]}</a>
          <a href="#faq">{t.nav[3]}</a>
        </nav>
        <div className="header-actions">
          <select aria-label="Language" value={lang} onChange={(event) => setLang(event.target.value)}>
            {languageOrder.map((code) => (
              <option key={code} value={code}>
                {languageLabels[code]}
              </option>
            ))}
          </select>
          <a className="button primary small" href="#lead-check">
            {t.cta}
          </a>
        </div>
      </header>

      <main>
        <section className="hero section">
          <div className="hero-copy">
            <h1>{t.h1}</h1>
            <p className="lead">{t.lead}</p>
            <p className="muted">{t.sub}</p>
            <div className="actions">
              <a className="button primary" href="#lead-check">
                {t.cta}
              </a>
              <a className="button quiet" href="#how">
                {t.secondary}
              </a>
            </div>
            <p className="proof">{t.proof}</p>
          </div>
          <DiagnosticCard t={t} />
        </section>

        <section className="section problem">
          <p className="kicker">{t.problemKicker}</p>
          <h2>{t.problemTitle}</h2>
          <div className="problem-grid">
            {t.problems.map(([title, copy]) => (
              <article className="problem-card" key={title}>
                <span className="icon-box" aria-hidden="true">!</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section steps" id="how">
          <p className="kicker">{t.nav[0]}</p>
          <h2>{t.stepsTitle}</h2>
          <div className="step-list">
            {t.steps.map((step, index) => (
              <div className="step" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section offer" id="diagnostic">
          <div>
            <p className="kicker">Veris Check</p>
            <h2>{t.diagnosticTitle}</h2>
            <p>{t.diagnosticText}</p>
          </div>
          <div className="price-panel">
            <span>{t.price}</span>
            <a className="button primary" href="#lead-check">{t.cta}</a>
          </div>
        </section>

        <section className="section lead-section" id="lead-check">
          <div className="lead-copy">
            <div className="lead-heading">
              <p className="kicker">{t.cta}</p>
              <h2>{t.formTitle}</h2>
            </div>
            <ul className="compact-list">
              <li>{t.time}</li>
              <li>{t.proof}</li>
              <li>{q.clearStep}</li>
            </ul>
          </div>
          <details className="questionnaire-dropdown">
            <summary>
              <span className="dropdown-title">{q.title}</span>
              <span className="dropdown-meta">{q.meta}</span>
              <span className="dropdown-action" aria-hidden="true">
                <span className="action-open">{q.open}</span>
                <span className="action-close">{q.close}</span>
              </span>
            </summary>
            <form className="lead-form large-lead-form detailed-check-form" onSubmit={(event) => event.preventDefault()}>
              <div className="form-group-title full">{q.groups[0]}</div>
              <FormSelect label={q.selects[0][0]} options={q.selects[0][1]} className="full" />
              <TextField label={q.textFields[0][0]} placeholder={q.textFields[0][1]} className="full" />
              <TextField label={q.textFields[1][0]} placeholder={q.textFields[1][1]} className="full" />
              <div className="form-group-title full">{q.groups[1]}</div>
              <FormSelect label={q.selects[1][0]} options={q.selects[1][1]} />
              <FormSelect label={q.selects[2][0]} options={q.selects[2][1]} />
              <FormSelect label={q.selects[3][0]} options={q.selects[3][1]} className="full" />
              <FormSelect label={q.selects[4][0]} options={q.selects[4][1]} className="full" />
              <div className="form-group-title full">{q.groups[2]}</div>
              <FormSelect label={q.selects[5][0]} options={q.selects[5][1]} />
              <TextField label={q.textFields[2][0]} placeholder={q.textFields[2][1]} />
              <TextField label={q.textFields[3][0]} placeholder={q.textFields[3][1]} className="full" />
              <label className="form-field full">
                <span>{q.notesLabel}</span>
                <textarea rows="5" placeholder={q.optional} />
              </label>
              <label className="consent full">
                <input type="checkbox" />
                <span>{q.consent}</span>
              </label>
              <button className="button primary full" type="submit">{q.submit}</button>
            </form>
          </details>
        </section>

        <section className="section checks" id="checks">
          <p className="kicker">{t.nav[1]}</p>
          <h2>{t.checksTitle}</h2>
          <div className="check-grid">
            {t.checks.map((check) => (
              <div className="check-item" key={check}>{check}</div>
            ))}
          </div>
        </section>

        <section className="section compliance">
          <h2>{t.complianceTitle}</h2>
          <p>{t.compliance}</p>
        </section>

        <section className="section faq" id="faq">
          <p className="kicker">FAQ</p>
          <h2>{t.faqTitle}</h2>
          <div className="faq-list">
            {t.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section final-cta">
          <h2>{t.finalTitle}</h2>
          <p>{t.finalCopy}</p>
          <a className="button primary" href="#lead-check">{t.cta}</a>
        </section>
      </main>

      <footer className="footer">
        <img className="footer-logo" src="/veris-full-logo.png" alt="Veris" />
        <p>{t.footer}</p>
        <p>{t.contact}</p>
      </footer>
    </>
  );
}

function DiagnosticCard({ t }) {
  return (
    <aside className="diagnostic-card" aria-label="Diagnostic preview">
      <div className="card-top">
        <span>Veris Check</span>
        <strong>68</strong>
      </div>
      <h3>{t.cardTitle}</h3>
      <p>{t.cardMeta}</p>
      <div className="meters">
        <Meter label={t.meters[0]} value="72" />
        <Meter label={t.meters[1]} value="42" />
        <Meter label={t.meters[2]} value="36" />
      </div>
      <div className="review-box">
        <strong>{t.reviewTitle}</strong>
        {t.checkItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <a className="button dark" href="#lead-check">{t.cta}</a>
    </aside>
  );
}

function TextField({ label, placeholder, className = "" }) {
  return (
    <label className={`form-field ${className}`}>
      <span>{label}</span>
      <input type="text" placeholder={placeholder} />
    </label>
  );
}

function FormSelect({ label, options, className = "" }) {
  return (
    <label className={`form-field ${className}`}>
      <span>{label}</span>
      <select defaultValue="">
        {options.map((option, index) => (
          <option key={option} value={index === 0 ? "" : option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Meter({ label, value, color }) {
  return (
    <div className="meter">
      <div className="meter-label">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="track">
        <span className={color} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
