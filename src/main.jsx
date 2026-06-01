import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const benefits = [
  "2 хвилини",
  "Без фальшивих обіцянок",
  "Зрозумілий наступний крок",
  "Якщо не підходить, скажемо прямо"
];

const selectFields = [
  ["Ситуація", ["Оберіть варіант", "Я вже autonomo", "Планую стати autonomo", "Маю малий бізнес", "Хочу перевірити ідею"]],
  ["Вік бізнесу", ["Оберіть варіант", "Ще не зареєстрований", "До 6 місяців", "6-24 місяці", "Більше 2 років"]],
  ["Орієнтовна сума", ["Оберіть варіант", "До 3 000 EUR", "3 000-10 000 EUR", "10 000-30 000 EUR", "Понад 30 000 EUR"]],
  ["Для чого потрібна підтримка?", ["Оберіть варіант", "Обладнання", "Цифровізація", "Запуск бізнесу", "Оборотні кошти", "Інше"]],
  ["Інвестиція", ["Оберіть варіант", "Планується", "Вже зроблена", "Частково зроблена", "Поки не знаю"]],
  ["Бажаний контакт", ["Оберіть варіант", "Email", "WhatsApp", "Телефон"]]
];

function App() {
  return (
    <main className="check-page">
      <section className="check-copy" aria-labelledby="check-title">
        <p className="kicker">Перевірити випадок</p>
        <h1 id="check-title">Почніть з ясної оцінки вашої ситуації.</h1>
        <ul className="benefit-list">
          {benefits.map((benefit, index) => (
            <li key={benefit}>
              <Icon index={index} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <p className="note">
          Ця форма поки не надсилає дані в backend. TODO: підключити webhook, CRM, email або Google Sheets перед запуском.
        </p>
      </section>

      <section className="form-card" aria-label="Форма перевірки випадку">
        <form onSubmit={(event) => event.preventDefault()}>
          <FormSelect label={selectFields[0][0]} options={selectFields[0][1]} className="full" />
          <TextField label="Місто і регіон" placeholder="Напр. Аліканте, Валенсійська спільнота" className="full" />
          <TextField label="Сектор або діяльність" placeholder="Напр. торгівля, horeca, послуги..." className="full" />
          <FormSelect label={selectFields[1][0]} options={selectFields[1][1]} />
          <FormSelect label={selectFields[2][0]} options={selectFields[2][1]} />
          <FormSelect label={selectFields[3][0]} options={selectFields[3][1]} className="full" />
          <FormSelect label={selectFields[4][0]} options={selectFields[4][1]} className="full" />
          <FormSelect label={selectFields[5][0]} options={selectFields[5][1]} />
          <TextField label="Контакт" placeholder="Email або телефон" />
          <TextField label="Конкретна програма, якщо вже є" placeholder="Необов'язково" className="full" />
          <label className="field full">
            <span>Щось важливе про ваш випадок</span>
            <textarea rows="5" placeholder="Необов'язково" />
          </label>
          <label className="consent full">
            <input type="checkbox" />
            <span>
              Я погоджуюсь, щоб Veris розглянув цю інформацію для відповіді щодо мого випадку. TODO: додати
              реальну політику приватності.
            </span>
          </label>
          <button className="submit-button full" type="submit">
            Надіслати на перевірку
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </main>
  );
}

function TextField({ label, placeholder, className = "" }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <input type="text" placeholder={placeholder} />
    </label>
  );
}

function FormSelect({ label, options, className = "" }) {
  return (
    <label className={`field ${className}`}>
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

function Icon({ index }) {
  const paths = [
    "M12 7v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
    "M12 2l2.1 3.4 4-.2 1.8 3.6 3.1 2.5-1.2 3.8.8 3.9-3.8 1.3-2.7 3-3.7-1.5-3.7 1.5-2.7-3-3.8-1.3.8-3.9-1.2-3.8 3.1-2.5 1.8-3.6 4 .2L12 2Z",
    "M4 7h4M4 12h4M4 17h4M12 7l2 2 5-5M12 12l2 2 5-5M12 17l2 2 5-5",
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
  ];

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[index]} />
    </svg>
  );
}

createRoot(document.getElementById("root")).render(<App />);
