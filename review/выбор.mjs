/**
 * Картинки для выбора: по одному расхождению на снимок, варианты пронумерованы.
 *
 *   node review/выбор.mjs            — все расхождения, светлая и тёмная
 *   node review/выбор.mjs --only=а1  — одно
 *
 * Берёт карточки прямо со страницы сверки, а не повторяет их разметку: вторая
 * копия вариантов разошлась бы с первой на второй же правке. Со снимка
 * убирается всё, что подсказывает ответ, — подкраска предлагаемого варианта,
 * ярлык «предлагаю» и блок рекомендации. Остаются сами варианты и их мерки.
 *
 * Обе темы снимаются всегда: половина выборов (чёрная кнопка, подложка чипа,
 * плакат) в тёмной теме выглядит иначе, чем в светлой, и выбирать по одной
 * светлой картинке — значит выбирать вслепую.
 */
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const lab = resolve(here, "../lab");

const где = [
  process.env.PLAYWRIGHT_HOME,
  resolve(here, "../../glagol-atlas"),
  join(homedir(), "dev/glagol-atlas"),
].filter(Boolean);
let chromium;
for (const путь of где) {
  if (!existsSync(join(путь, "node_modules/playwright"))) continue;
  ({ chromium } = createRequire(join(путь, "package.json"))("playwright"));
  break;
}
if (!chromium) {
  console.error("Playwright не найден. Он живёт у атласа:\n  " + где.join("\n  "));
  process.exit(1);
}

const КАРКАС = (тело) => `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>
  :root { color-scheme: light }
  body { margin: 0; font: 14px system-ui, sans-serif }
  img { max-width: 100% }
  [hidden] { display: none !important }
</style>
</head><body>
${тело}
</body></html>`;

const ТИПЫ = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const server = createServer(async (req, res) => {
  const имя = decodeURIComponent(req.url.split("?")[0]) === "/"
    ? "index.html"
    : req.url.replace(/^\//, "");
  for (const папка of [here, lab]) {
    try {
      const body = await readFile(join(папка, имя));
      res.writeHead(200, { "Content-Type": ТИПЫ[extname(имя)] || "application/octet-stream" });
      res.end(имя === "index.html" ? КАРКАС(body.toString("utf8")) : body);
      return;
    } catch {
      /* ищем в следующей папке */
    }
  }
  res.writeHead(404).end("нет такого файла");
});
const PORT = 4176;
await new Promise((ok) => server.listen(PORT, ok));

/* Порядок — тот, в котором их показываю Артёму: сначала то, что меняет облик,
   потом то, что меняет только порядок. Утверждённые карточки (А2) в выбор не
   идут: выбирать там нечего. */
const РАСХОЖДЕНИЯ = [
  { id: "а1", имя: "Главное действие экрана" },
  { id: "б1", имя: "Заголовок экрана" },
  { id: "б4", имя: "Лестница кеглей" },
  { id: "а3", имя: "Круглая кнопка-иконка" },
  { id: "а7", имя: "Область касания на телефоне" },
  { id: "б2", имя: "Заголовок раздела" },
  { id: "б3", имя: "Подпись-ярлык" },
  { id: "а4", имя: "Отбор и состояние" },
  { id: "а5", имя: "Ссылка-кнопка" },
  { id: "а6", имя: "Отклик на нажатие" },
  { id: "б5", имя: "Числа" },
];

const only = (process.argv.find((a) => a.startsWith("--only=")) || "").split("=")[1] || "";
const список = РАСХОЖДЕНИЯ.filter((р) => !only || р.id === only);

const куда = join(here, "shots", "выбор");
if (!only) await rm(куда, { recursive: true, force: true });
await mkdir(куда, { recursive: true });

const browser = await chromium.launch();
const беды = [];

for (const тема of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 2,
    colorScheme: тема,
    locale: "ru-RU",
  });
  await ctx.addInitScript((т) => {
    try {
      localStorage.setItem("glagol-review-theme", т);
    } catch {}
  }, тема);
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "load", timeout: 25000 });
  await page.waitForTimeout(800);

  // Готовим страницу один раз на тему: нумеруем варианты, снимаем подсказки.
  await page.addStyleTag({
    content: `
      .в-номер {
        position: absolute; top: 0; left: 0;
        min-width: 26px; height: 24px; padding: 0 8px;
        display: inline-flex; align-items: center; justify-content: center;
        font-family: var(--font-onest); font-weight: 900; font-size: 13px;
        background: var(--foreground); color: var(--background);
        border-bottom-right-radius: 10px;
      }
      .в { padding-top: 30px }
      .реко, .р .метка { display: none }
    `,
  });
  await page.evaluate(() => {
    for (const карточка of document.querySelectorAll("article.р")) {
      let n = 0;
      for (const фигура of карточка.querySelectorAll(".в")) {
        фигура.removeAttribute("data-реко");
        const номер = document.createElement("span");
        номер.className = "в-номер";
        номер.textContent = String(++n);
        фигура.prepend(номер);
      }
    }
  });
  await page.waitForTimeout(200);

  for (const р of список) {
    const el = await page.$(`#${р.id}`);
    if (!el) {
      беды.push(`${р.id}: карточки нет на странице`);
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    // Качество почти предельное и не случайно: при 88 вокруг чёрной капсулы
    // на светлом появляется серый ореол, и кнопка выглядит обведённой —
    // то есть снимок врёт ровно о том, что по нему выбирают.
    await el.screenshot({
      path: join(куда, `${р.id}-${тема}.jpg`),
      type: "jpeg",
      quality: 96,
    });
  }
  console.log(`✓ ${тема} — ${список.length} шт.`);
  await ctx.close();
}

await browser.close();
server.close();

if (беды.length) {
  for (const b of беды) console.log(`! ${b}`);
  process.exit(1);
}
console.log(`\nготово: ${куда}`);
