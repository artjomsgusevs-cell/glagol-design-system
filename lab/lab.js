/*
 * Переключатели Design Lab: тема и ширина полосы образцов.
 *
 * Тема ставится атрибутом `data-theme` на корне — так её понимает и
 * опубликованная страница, и tokens.css. Вместе с атрибутом ставится класс
 * `dark`: три правила work.css смотрят именно на класс, потому что в продукте
 * тему переключает next-themes.
 *
 * «Системная» — это отсутствие атрибута: дальше решает prefers-color-scheme.
 * Выбор храним в localStorage, но страница обязана работать и без него:
 * в приватном окне обращение к хранилищу падает.
 */
(() => {
  const root = document.documentElement;
  const KEY = "glagol-lab-theme";
  const BENCH = "glagol-lab-bench";

  const системная = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const прочитать = (key, fallback) => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const записать = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* приватное окно — переключатель работает, просто не помнит */
    }
  };

  function применитьТему(выбор) {
    const реальная = выбор === "system" ? системная() : выбор;
    if (выбор === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", выбор);
    root.classList.toggle("dark", реальная === "dark");

    for (const b of document.querySelectorAll("[data-theme-btn]")) {
      b.setAttribute("aria-pressed", String(b.dataset.themeBtn === выбор));
    }
    // Снимки сняты в обеих темах: показываем ту, что выбрана, иначе тёмная
    // страница показывала бы светлые картинки и врала о себе.
    for (const img of document.querySelectorAll("img[data-shot]")) {
      img.src = `shots/${img.dataset.shot}-${реальная}.jpg`;
    }
  }

  function применитьШирину(выбор) {
    root.setAttribute("data-bench", выбор);
    for (const b of document.querySelectorAll("[data-bench-btn]")) {
      b.setAttribute("aria-pressed", String(b.dataset.benchBtn === выбор));
    }
  }

  let тема = прочитать(KEY, "system");
  if (!["light", "dark", "system"].includes(тема)) тема = "system";
  применитьТему(тема);
  применитьШирину(прочитать(BENCH, "free") === "375" ? "375" : "free");

  // Скрипт подключается синхронно в <head>, чтобы тема встала до первого
  // кадра и страница не мигала светлым. Кнопок и картинок в этот момент ещё
  // нет — досинхронизируем их, когда разметка разобрана.
  document.addEventListener("DOMContentLoaded", () => {
    применитьТему(тема);
    применитьШирину(root.getAttribute("data-bench") || "free");
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-theme-btn]");
    if (t) {
      тема = t.dataset.themeBtn;
      записать(KEY, тема);
      применитьТему(тема);
      return;
    }
    const w = e.target.closest("[data-bench-btn]");
    if (w) {
      записать(BENCH, w.dataset.benchBtn);
      применитьШирину(w.dataset.benchBtn);
    }
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => тема === "system" && применитьТему("system"));
})();
