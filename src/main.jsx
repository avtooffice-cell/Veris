import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const STORAGE_KEY = "veris-client-cards";
const DRAFT_KEY = "veris-scoring-draft";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const defaultForm = {
  clientName: "",
  contact: "",
  age: 35,
  maritalStatus: "Одружений/заміжня",
  nationality: "Іспанська",
  residence: "Резидент",
  employmentType: "Безстроковий",
  seniorityMonths: 36,
  netIncome: 2500,
  otherIncome: 0,
  currentPayments: 500,
  creditHistory: "Добра",
  housing: "Оренда",
  savings: 8000,
  loanAmount: 20000,
  loanTermMonths: 60,
  purpose: "Автомобіль",
  notes: ""
};

const options = {
  maritalStatus: ["Неодружений/незаміжня", "Одружений/заміжня", "Розлучений/розлучена", "Вдівець/вдова"],
  nationality: ["Іспанська", "Українська", "Інша ЄС", "Інша не ЄС"],
  residence: ["Резидент", "Нерезидент", "У процесі оформлення"],
  employmentType: ["Безстроковий", "Тимчасовий", "Автономо", "Безробітний/інше"],
  creditHistory: ["Відмінна", "Добра", "Середня", "Погана (ASNEF/RAI)", "Без історії"],
  housing: ["Власник", "Іпотека", "Оренда", "Інше"],
  purpose: ["Автомобіль", "Обладнання", "Цифровізація", "Оборотні кошти", "Запуск бізнесу", "Інше"]
};

const sourceFields = [
  ["D6", "Edad", "Вік"],
  ["D13", "Tipo de Empleo", "Тип зайнятості"],
  ["D14", "Antigüedad", "Стаж, місяців"],
  ["D15", "Ingresos Netos Mensuales", "Чистий місячний дохід"],
  ["D16", "Otros Ingresos", "Інші доходи"],
  ["D20", "Pagos Mensuales Actuales", "Поточні щомісячні платежі"],
  ["D21", "Historial Crediticio", "Кредитна історія"],
  ["D22", "Vivienda", "Житло"],
  ["D23", "Ahorros Disponibles", "Доступні заощадження"],
  ["D27", "Importe Solicitado", "Запитувана сума"],
  ["D28", "Plazo", "Строк, місяців"],
  ["D29", "Finalidad", "Мета"]
];

const criteria = [
  { key: "age", label: "Вік", weight: "10%", max: 10, optimal: "25-55 років" },
  { key: "employment", label: "Стабільність роботи", weight: "20%", max: 20, optimal: "Безстроковий > 12 міс." },
  { key: "income", label: "Дохід", weight: "20%", max: 20, optimal: "> 1 500 EUR/міс." },
  { key: "dti", label: "DTI", weight: "20%", max: 20, optimal: "< 40%" },
  { key: "credit", label: "Кредитна історія", weight: "15%", max: 15, optimal: "Без інцидентів" },
  { key: "savings", label: "Заощадження", weight: "10%", max: 10, optimal: "> 10% кредиту" },
  { key: "housing", label: "Житло", weight: "5%", max: 5, optimal: "Власник" }
];

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function pmt(monthlyRate, months, principal) {
  if (months <= 0 || principal <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function calculateScoring(raw) {
  const form = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      typeof defaultForm[key] === "number" ? toNumber(value) : value
    ])
  );

  const monthlyIncome = form.netIncome + form.otherIncome;
  const monthlyPayment = pmt(0.08 / 12, form.loanTermMonths, form.loanAmount);
  const currentDti = monthlyIncome > 0 ? (form.currentPayments / monthlyIncome) * 100 : 999;
  const loanToAnnualIncome = form.netIncome > 0 ? (form.loanAmount / (form.netIncome * 12)) * 100 : 999;
  const totalDti = monthlyIncome > 0 ? ((form.currentPayments + monthlyPayment) / monthlyIncome) * 100 : 999;

  const points = {
    age: form.age < 25 ? 5 : form.age <= 55 ? 10 : form.age <= 65 ? 7 : 3,
    employment: getEmploymentPoints(form.employmentType, form.seniorityMonths),
    income: form.netIncome >= 3000 ? 20 : form.netIncome >= 2000 ? 18 : form.netIncome >= 1500 ? 15 : form.netIncome >= 1000 ? 10 : 5,
    dti: currentDti < 30 ? 20 : currentDti < 40 ? 15 : currentDti < 50 ? 10 : currentDti < 60 ? 5 : 0,
    credit: getCreditPoints(form.creditHistory),
    savings: form.savings >= form.loanAmount * 0.2 ? 10 : form.savings >= form.loanAmount * 0.1 ? 7 : form.savings >= form.loanAmount * 0.05 ? 4 : 0,
    housing: form.housing === "Власник" ? 5 : form.housing === "Оренда" ? 3 : form.housing === "Іпотека" ? 4 : 2
  };

  const total = Object.values(points).reduce((sum, value) => sum + value, 0);
  const approved =
    total >= 60 &&
    totalDti < 50 &&
    form.netIncome >= 1000 &&
    form.employmentType !== "Безробітний/інше" &&
    form.creditHistory !== "Погана (ASNEF/RAI)";

  return {
    form,
    indicators: { currentDti, loanToAnnualIncome, monthlyPayment, totalDti },
    points,
    total,
    percentage: total / 100,
    approved,
    risk: total >= 80 ? "НИЗЬКИЙ" : total >= 60 ? "СЕРЕДНІЙ" : total >= 40 ? "ВИСОКИЙ" : "ДУЖЕ ВИСОКИЙ",
    offer: total >= 80 ? "Преференційний тип" : total >= 60 ? "Стандартні умови" : total >= 40 ? "Потрібні гарантії" : "Не рекомендувати",
    amountAdvice: totalDti > 50 ? "Зменшити суму" : "Сума адекватна",
    verification: form.creditHistory === "Погана (ASNEF/RAI)" ? "ВІДХИЛИТИ - ASNEF/RAI" : "Перевірити документацію"
  };
}

function getEmploymentPoints(type, months) {
  if (type === "Безстроковий") return months >= 24 ? 20 : months >= 12 ? 18 : 15;
  if (type === "Тимчасовий") return months >= 12 ? 12 : 8;
  if (type === "Автономо") return months >= 24 ? 14 : 10;
  return 0;
}

function getCreditPoints(history) {
  if (history === "Відмінна") return 15;
  if (history === "Добра") return 12;
  if (history === "Середня") return 8;
  if (history === "Без історії") return 5;
  return 0;
}

function buildClientCard(scoring, id, mode = "Автозбережено") {
  return {
    id,
    mode,
    createdAt: new Date().toLocaleString("uk-UA"),
    ...scoring.form,
    total: scoring.total,
    approved: scoring.approved,
    risk: scoring.risk,
    currentDti: scoring.indicators.currentDti,
    totalDti: scoring.indicators.totalDti,
    monthlyPayment: scoring.indicators.monthlyPayment,
    offer: scoring.offer,
    amountAdvice: scoring.amountAdvice,
    verification: scoring.verification
  };
}

async function saveCardToSupabase(card) {
  if (!SUPABASE_ENABLED) {
    return { saved: false, reason: "supabase_not_configured" };
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/client_scoring_cases`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      local_card_id: card.id,
      client_name: card.clientName || null,
      contact: card.contact || null,
      source: card.mode,
      input_data: {
        age: card.age,
        maritalStatus: card.maritalStatus,
        nationality: card.nationality,
        residence: card.residence,
        employmentType: card.employmentType,
        seniorityMonths: card.seniorityMonths,
        netIncome: card.netIncome,
        otherIncome: card.otherIncome,
        currentPayments: card.currentPayments,
        creditHistory: card.creditHistory,
        housing: card.housing,
        savings: card.savings,
        loanAmount: card.loanAmount,
        loanTermMonths: card.loanTermMonths,
        purpose: card.purpose,
        notes: card.notes
      },
      scoring_result: {
        total: card.total,
        approved: card.approved,
        risk: card.risk,
        currentDti: card.currentDti,
        totalDti: card.totalDti,
        monthlyPayment: card.monthlyPayment,
        offer: card.offer,
        amountAdvice: card.amountAdvice,
        verification: card.verification
      },
      total_score: card.total,
      approved: card.approved,
      risk_level: card.risk,
      total_dti: card.totalDti,
      monthly_payment: card.monthlyPayment,
      recommendation: `${card.offer}; ${card.amountAdvice}; ${card.verification}`
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase save failed: ${response.status}`);
  }

  return { saved: true };
}

function formatMoney(value) {
  return new Intl.NumberFormat("uk-UA", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value || 0);
}

function formatPercent(value) {
  return `${Number.isFinite(value) ? value.toFixed(1) : "0.0"}%`;
}

function App() {
  const [form, setForm] = useState(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    return draft ? { ...defaultForm, ...JSON.parse(draft) } : defaultForm;
  });
  const [cards, setCards] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  const [savedMessage, setSavedMessage] = useState("Результат оновлюється під час введення");
  const [touched, setTouched] = useState(false);
  const activeCardId = useRef(crypto.randomUUID());
  const scoring = useMemo(() => calculateScoring(form), [form]);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    if (!touched) return undefined;
    const timeout = window.setTimeout(() => {
      const card = buildClientCard(scoring, activeCardId.current);
      setCards((current) => {
        const withoutCurrent = current.filter((item) => item.id !== activeCardId.current);
        return [card, ...withoutCurrent];
      });
      setSavedMessage(`Карту клієнта автоматично збережено локально: ${card.createdAt}`);
      saveCardToSupabase(card)
        .then((result) => {
          if (result.saved) setSavedMessage(`Карту клієнта збережено локально і в Supabase: ${card.createdAt}`);
        })
        .catch((error) => {
          setSavedMessage(`Локально збережено. Supabase не прийняв запис: ${error.message}`);
        });
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [scoring, touched]);

  function updateField(key, value) {
    setTouched(true);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function saveSnapshot() {
    const card = buildClientCard(scoring, crypto.randomUUID(), "Знімок");
    setCards((current) => [card, ...current]);
    setSavedMessage(`Знімок карти збережено: ${card.createdAt}`);
    saveCardToSupabase(card)
      .then((result) => {
        if (result.saved) setSavedMessage(`Знімок карти збережено локально і в Supabase: ${card.createdAt}`);
      })
      .catch((error) => {
        setSavedMessage(`Знімок локально збережено. Supabase не прийняв запис: ${error.message}`);
      });
  }

  function clearCards() {
    setCards([]);
    activeCardId.current = crypto.randomUUID();
    setSavedMessage("Таблицю карт клієнтів очищено");
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Veris">
          <img className="brand-logo" src="/veris-full-logo.png" alt="Veris" />
          <span className="brand-slogan">Скорингова модель</span>
        </a>
        <nav className="nav-links" aria-label="Навігація">
          <a href="#input">Дані</a>
          <a href="#result">Результат</a>
          <a href="#criteria">Критерії</a>
          <a href="#cards">Карти</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section scoring-hero">
          <div className="hero-copy">
            <p className="eyebrow">Veris Credit Scoring</p>
            <h1>Скорингова модель для Veris</h1>
            <p className="lead">
              Дані вводяться за структурою аркуша “Datos Cliente”. Результат нижче форми повторює формули з аркуша “Resultado”:
              DTI, платіж при 8% TIN, 100-бальну оцінку, рішення, ризик і рекомендації.
            </p>
            <p className="muted">
              Supabase: {SUPABASE_ENABLED ? "підключення налаштовано через змінні середовища" : "потрібні VITE_SUPABASE_URL і VITE_SUPABASE_ANON_KEY"}
            </p>
            <p className="proof"><span aria-hidden="true">*</span>Це попередній скоринг, не гарантія рішення банку або фінансової установи.</p>
          </div>
        </section>

        <section className="section scoring-workspace" id="input">
          <form className="lead-form scoring-form" onSubmit={(event) => event.preventDefault()}>
            <SectionTitle title="Карта клієнта" />
            <TextField label="Ім'я клієнта" value={form.clientName} onChange={(value) => updateField("clientName", value)} placeholder="Напр. Олена К." />
            <TextField label="Контакт" value={form.contact} onChange={(value) => updateField("contact", value)} placeholder="Email або телефон" />

            <SectionTitle title="Особиста інформація" />
            <NumberField label="Вік" value={form.age} onChange={(value) => updateField("age", value)} suffix="років" min="18" />
            <SelectField label="Сімейний стан" value={form.maritalStatus} onChange={(value) => updateField("maritalStatus", value)} options={options.maritalStatus} />
            <SelectField label="Національність" value={form.nationality} onChange={(value) => updateField("nationality", value)} options={options.nationality} />
            <SelectField label="Резиденція" value={form.residence} onChange={(value) => updateField("residence", value)} options={options.residence} />

            <SectionTitle title="Робота та доходи" />
            <SelectField label="Тип зайнятості" value={form.employmentType} onChange={(value) => updateField("employmentType", value)} options={options.employmentType} />
            <NumberField label="Стаж" value={form.seniorityMonths} onChange={(value) => updateField("seniorityMonths", value)} suffix="міс." min="0" />
            <NumberField label="Чистий місячний дохід" value={form.netIncome} onChange={(value) => updateField("netIncome", value)} suffix="EUR" min="0" />
            <NumberField label="Інші доходи" value={form.otherIncome} onChange={(value) => updateField("otherIncome", value)} suffix="EUR/міс." min="0" />

            <SectionTitle title="Фінансова ситуація" />
            <NumberField label="Поточні щомісячні платежі" value={form.currentPayments} onChange={(value) => updateField("currentPayments", value)} suffix="EUR" min="0" />
            <SelectField label="Кредитна історія" value={form.creditHistory} onChange={(value) => updateField("creditHistory", value)} options={options.creditHistory} />
            <SelectField label="Житло" value={form.housing} onChange={(value) => updateField("housing", value)} options={options.housing} />
            <NumberField label="Доступні заощадження" value={form.savings} onChange={(value) => updateField("savings", value)} suffix="EUR" min="0" />

            <SectionTitle title="Деталі кредиту" />
            <NumberField label="Запитувана сума" value={form.loanAmount} onChange={(value) => updateField("loanAmount", value)} suffix="EUR" min="0" />
            <NumberField label="Строк" value={form.loanTermMonths} onChange={(value) => updateField("loanTermMonths", value)} suffix="міс." min="1" />
            <SelectField label="Мета" value={form.purpose} onChange={(value) => updateField("purpose", value)} options={options.purpose} />
            <label className="form-field full">
              <span>Нотатки</span>
              <textarea rows="4" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Важливі деталі щодо клієнта" />
            </label>

            <div className="form-actions full">
              <span>{savedMessage}</span>
              <button className="button primary" type="button" onClick={saveSnapshot}>Зберегти знімок карти</button>
            </div>
          </form>
        </section>

        <section className="section result-section" id="result">
          <div className={`diagnostic-card result-card ${scoring.approved ? "approved" : "declined"}`}>
            <div className="card-top">
              <span>Результат після введення даних</span>
              <strong>{scoring.total}</strong>
            </div>
            <h2>{scoring.approved ? "Попередньо схвалено" : "Попередньо не схвалено"}</h2>
            <p>Рівень ризику: {scoring.risk}</p>
            <div className="meters">
              <Meter label="Поточний DTI" value={Math.min(scoring.indicators.currentDti, 100)} display={formatPercent(scoring.indicators.currentDti)} />
              <Meter label="DTI з новим кредитом" value={Math.min(scoring.indicators.totalDti, 100)} display={formatPercent(scoring.indicators.totalDti)} />
              <Meter label="Сума / річний дохід" value={Math.min(scoring.indicators.loanToAnnualIncome, 100)} display={formatPercent(scoring.indicators.loanToAnnualIncome)} />
            </div>
            <div className="review-box">
              <span>Орієнтовний платіж: {formatMoney(scoring.indicators.monthlyPayment)}</span>
              <span>Пропозиція: {scoring.offer}</span>
              <span>Сума: {scoring.amountAdvice}</span>
              <span>Перевірка: {scoring.verification}</span>
            </div>
          </div>

          <aside className="score-breakdown">
            <h2>Розбивка балів</h2>
            <div className="criteria-list">
              {criteria.map((item) => (
                <div className="criterion" key={item.key}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.optimal}</span>
                  </div>
                  <b>{scoring.points[item.key]} / {item.max}</b>
                </div>
              ))}
            </div>
            <div className="decision-rules">
              <h3>Умови схвалення</h3>
              <Rule passed={scoring.total >= 60} text="Підсумок не менше 60 балів" />
              <Rule passed={scoring.indicators.totalDti < 50} text="DTI з новим кредитом нижче 50%" />
              <Rule passed={scoring.form.netIncome >= 1000} text="Чистий дохід від 1 000 EUR" />
              <Rule passed={scoring.form.employmentType !== "Безробітний/інше"} text="Клієнт не у статусі безробітний/інше" />
              <Rule passed={scoring.form.creditHistory !== "Погана (ASNEF/RAI)"} text="Немає ASNEF/RAI" />
            </div>
          </aside>
        </section>

        <section className="section criteria-source" id="criteria">
          <div className="cards-heading">
            <div>
              <p className="kicker">Дані з Excel</p>
              <h2>Поля та критерії моделі</h2>
            </div>
          </div>
          <div className="source-grid">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Клітинка</th>
                    <th>Excel</th>
                    <th>Українське поле</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceFields.map(([cell, excel, uk]) => (
                    <tr key={cell}>
                      <td>{cell}</td>
                      <td>{excel}</td>
                      <td>{uk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Критерій</th>
                    <th>Вага</th>
                    <th>Макс.</th>
                    <th>Оптимум</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((item) => (
                    <tr key={item.key}>
                      <td>{item.label}</td>
                      <td>{item.weight}</td>
                      <td>{item.max}</td>
                      <td>{item.optimal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section client-cards" id="cards">
          <div className="cards-heading">
            <div>
              <p className="kicker">Окрема таблиця</p>
              <h2>Автоматично збережені карти клієнтів</h2>
            </div>
            <button className="button quiet" type="button" onClick={clearCards} disabled={cards.length === 0}>Очистити таблицю</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Тип</th>
                  <th>Клієнт</th>
                  <th>Контакт</th>
                  <th>Сума</th>
                  <th>Платіж</th>
                  <th>DTI</th>
                  <th>Бал</th>
                  <th>Рішення</th>
                  <th>Ризик</th>
                  <th>Рекомендація</th>
                </tr>
              </thead>
              <tbody>
                {cards.length === 0 ? (
                  <tr>
                    <td colSpan="11">Почніть вводити дані клієнта. Карта автоматично зʼявиться тут.</td>
                  </tr>
                ) : (
                  cards.map((card) => (
                    <tr key={card.id}>
                      <td>{card.createdAt}</td>
                      <td>{card.mode}</td>
                      <td>{card.clientName || "Без імені"}</td>
                      <td>{card.contact || "-"}</td>
                      <td>{formatMoney(card.loanAmount)}</td>
                      <td>{formatMoney(card.monthlyPayment)}</td>
                      <td>{formatPercent(card.totalDti)}</td>
                      <td>{card.total}</td>
                      <td>{card.approved ? "Так" : "Ні"}</td>
                      <td>{card.risk}</td>
                      <td>{card.offer}; {card.amountAdvice}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}

function SectionTitle({ title }) {
  return <div className="form-group-title full">{title}</div>;
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input type="text" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function NumberField({ label, value, onChange, suffix, min }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <div className="input-with-suffix">
        <input type="number" min={min} value={value} onChange={(event) => onChange(event.target.value)} />
        <small>{suffix}</small>
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Meter({ label, value, display }) {
  return (
    <div className="meter">
      <div className="meter-label">
        <span>{label}</span>
        <span>{display}</span>
      </div>
      <div className="track">
        <span style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
      </div>
    </div>
  );
}

function Rule({ passed, text }) {
  return <p className={passed ? "rule passed" : "rule failed"}>{text}</p>;
}

createRoot(document.getElementById("root")).render(<App />);
