/**
 * Собрать стили Design Lab из настоящего кода дизайн-системы.
 *
 *   node lab/build.mjs
 *
 * Lab показывает не похожие элементы, а те же значения, что работают в
 * продукте, — то же правило, по которому живёт `sync-design`. Поэтому
 * `lab/tokens.css` и `lab/work.css` не пишутся руками: они вынимаются отсюда.
 *
 *   app/globals.css → lab/tokens.css   (:root и .dark как есть, плюс
 *                                       публичные утилиты .reveal/.grain/
 *                                       .section-rule)
 *   app/work.css    → lab/work.css     (байт в байт, с шапкой)
 *
 * Зачем перекладывать, а не ссылаться: страница Lab публикуется отдельным
 * артефактом и собирается из своих файлов. Tailwind там не собирается, поэтому
 * из globals.css берутся ровно переменные — остальное в нём директивы сборки.
 *
 * Тёмная тема переписывается в три блока вместо одного класса `.dark`:
 * опубликованная страница узнаёт тему из `prefers-color-scheme` либо из
 * атрибута `data-theme` на корне, а класс `.dark` ставит переключатель — три
 * правила work.css смотрят именно на него.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

/** Тело блока по селектору, со счётом скобок: вложенные правила не теряются. */
function block(css, selector) {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`не нашёл ${selector}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(open + 1, i).trim();
    }
  }
  throw new Error(`блок ${selector} не закрыт`);
}

const globals = readFileSync(resolve(root, "app/globals.css"), "utf8");
const light = block(globals, "\n:root {");
const dark = block(globals, "\n.dark {");
const utilities = block(globals, "@layer utilities {");

const отступ = (text, pad) =>
  text
    .split("\n")
    .map((l) => (l.trim() ? pad + l.trim() : ""))
    .join("\n");

const tokens = `/*
 * СГЕНЕРИРОВАНО: node lab/build.mjs. Руками не править.
 * Значения вынуты из app/globals.css — того файла, по которому работает
 * продукт. Разойтись с ним этот файл не может: он им и собран.
 */

/* Шрифты бюро. В продукте их подключает next/font, здесь — Google Fonts;
   начертания и сабсеты те же, кириллица обязательна. */
:root {
  --font-sans: "Manrope", "Helvetica Neue", Arial, sans-serif;
  --font-onest: "Onest", "Manrope", "Helvetica Neue", Arial, sans-serif;
  /* Запас под жест телефона. В продукте стоит в globals.css. */
  --app-safe-bottom: 14px;

${отступ(light, "  ")}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;

${отступ(dark, "    ")}
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;

${отступ(dark, "  ")}
}

/* Общее для обеих сред: кириллица, моноширинные цифры, плотный межбуквенный
   у плакатных заголовков. В продукте это @layer base. */
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  font-feature-settings: "ss01", "cv11";
}
table,
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
.font-display {
  font-family: var(--font-onest);
  letter-spacing: -0.015em;
}

/* ============================================================
   Публичная среда: приёмы, которые до v3.0.0 не были описаны словами.
   Вынуты как есть из @layer utilities в app/globals.css.
   ============================================================ */

${utilities.trim()}
`;

writeFileSync(resolve(here, "tokens.css"), tokens);

const work = readFileSync(resolve(root, "app/work.css"), "utf8");
writeFileSync(
  resolve(here, "work.css"),
  `/*\n * СГЕНЕРИРОВАНО: node lab/build.mjs. Копия app/work.css байт в байт.\n` +
    ` * Хозяин файла — календарь, сюда он приезжает npm run sync-design.\n */\n` +
    work,
);

console.log(
  `tokens.css: ${tokens.split("\n").length} строк · work.css: ${work.split("\n").length} строк`,
);
