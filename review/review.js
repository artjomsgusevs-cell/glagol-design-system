/*
 * Переключатели страницы сверки: тема и ширина сцен.
 *
 * Тема ставится атрибутом `data-theme` на корне — так её понимает tokens.css,
 * — и вместе с ним классом `dark`: три правила work.css смотрят именно на
 * класс, потому что в продукте тему переключает next-themes. «Системная» —
 * это отсутствие атрибута.
 *
 * Выбор храним в localStorage, но страница обязана работать и без него:
 * в приватном окне обращение к хранилищу падает.
 */
(() => {
  const корень = document.documentElement;
  const КЛЮЧ = "glagol-review-theme";
  const КЛЮЧ_Ш = "glagol-review-ширина";

  const системная = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const прочитать = (ключ, запас) => {
    try {
      return localStorage.getItem(ключ) ?? запас;
    } catch {
      return запас;
    }
  };
  const записать = (ключ, значение) => {
    try {
      localStorage.setItem(ключ, значение);
    } catch {
      /* приватное окно: переключатель работает, просто не помнит */
    }
  };

  function тема(выбор) {
    const реальная = выбор === "system" ? системная() : выбор;
    if (выбор === "system") корень.removeAttribute("data-theme");
    else корень.setAttribute("data-theme", выбор);
    корень.classList.toggle("dark", реальная === "dark");
    for (const b of document.querySelectorAll("[data-тема]"))
      b.setAttribute("aria-pressed", String(b.dataset.тема === выбор));
    записать(КЛЮЧ, выбор);
  }

  function ширина(выбор) {
    корень.setAttribute("data-сцена", выбор);
    for (const b of document.querySelectorAll("[data-ширина]"))
      b.setAttribute("aria-pressed", String(b.dataset.ширина === выбор));
    записать(КЛЮЧ_Ш, выбор);
  }

  // Ставим до первой отрисовки — иначе тёмная страница моргает светлой.
  тема(прочитать(КЛЮЧ, "system"));
  ширина(прочитать(КЛЮЧ_Ш, "free"));

  document.addEventListener("click", (e) => {
    const кнопка = e.target.closest("[data-тема], [data-ширина]");
    if (!кнопка) return;
    if (кнопка.dataset.тема) тема(кнопка.dataset.тема);
    else ширина(кнопка.dataset.ширина);
  });

  // Кнопки появляются позже скрипта: он стоит в head, чтобы тема не моргала.
  document.addEventListener("DOMContentLoaded", () => {
    тема(прочитать(КЛЮЧ, "system"));
    ширина(прочитать(КЛЮЧ_Ш, "free"));
  });

  // Системная тема может смениться, пока страница открыта.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!корень.hasAttribute("data-theme")) тема("system");
  });
})();
