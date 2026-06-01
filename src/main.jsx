import React, { useMemo, useState } from "react";
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

function App() {
  const [lang, setLang] = useState("uk");
  const t = translations[lang];
  const labels = useMemo(() => ({ uk: "UA", en: "EN" }), []);

  return (
    <>
      <header className="site-header" id="top">
        <a className="brand" href="#top" aria-label="Veris home">
          <BrandMark />
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
            {Object.keys(translations).map((code) => (
              <option key={code} value={code}>
                {labels[code]}
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
            <p className="eyebrow">{t.locale}</p>
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
            <p className="kicker">{t.cta}</p>
            <h2>{t.formTitle}</h2>
            <ul className="compact-list">
              <li>{t.time}</li>
              <li>{t.proof}</li>
            </ul>
          </div>
          <form className="lead-form" onSubmit={(event) => event.preventDefault()}>
            {t.fields.slice(0, 4).map((field) => (
              <label key={field}>
                <span>{field}</span>
                <input type={field.includes("Email") ? "email" : "text"} />
              </label>
            ))}
            <label className="full">
              <span>{t.fields[4]}</span>
              <textarea rows="4" />
            </label>
            <button className="button primary full" type="submit">{t.submit}</button>
          </form>
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
        <BrandMark />
        <p>{t.footer}</p>
        <p>{t.contact}</p>
      </footer>
    </>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-label="Veris">
      <span className="brand-symbol" aria-hidden="true">V</span>
      <span>Veris</span>
    </span>
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
