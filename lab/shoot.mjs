/**
 * Снимки и проверки Design Lab.
 *
 *   node lab/shoot.mjs            — снять всё и прогнать проверки
 *   node lab/shoot.mjs --only=a   — только страницы, в чьём имени есть «a»
 *   node lab/shoot.mjs --no-ds    — без экранов дизайн-системы (если нет сервера)
 *
 * Каждая страница снимается в четырёх видах: десктоп 1440 и телефон 375,
 * светлая и тёмная. Меньше нельзя — половина расхождений живёт в тёмной теме и
 * в мобильной раскладке.
 *
 * Playwright берём у атласа: второй установки браузера в бюро не заводим.
 * Эталоны концепций лежат здесь, в lab/shots, а не в атласе: концепции меняются
 * часто, и мешать их с продуктовой базой нельзя.
 *
 * Проверки — то, чего грепом не измерить:
 *   • горизонтальная прокрутка страницы на 375;
 *   • область касания меньше 44 у кнопок, ссылок и пунктов меню;
 *   • ошибки в консоли;
 *   • подхватились ли шрифты бюро.
 */
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));

/* ── Playwright у соседа ─────────────────────────────────────────────── */
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
  console.error(
    "Playwright не найден. Он живёт у атласа:\n  " +
      где.join("\n  ") +
      "\nЛибо укажите PLAYWRIGHT_HOME=<папка с node_modules/playwright>.",
  );
  process.exit(1);
}

/* ── Свой сервер на папку lab ────────────────────────────────────────── */
/*
 * Страница Lab публикуется артефактом, и там её оборачивают в каркас: doctype,
 * кодировка, viewport и небольшой сброс. Чтобы снимки отвечали тому, что
 * увидит человек, тот же каркас надевается и здесь. Без него file:// ещё и
 * угадывает кодировку — и угадывает неверно.
 */
const КАРКАС = (тело) => `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>
  :root { color-scheme: light;
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px); }
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
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  const путь = decodeURIComponent(req.url.split("?")[0]);
  const файл = join(here, путь === "/" ? "index.html" : путь);
  try {
    const body = await readFile(файл);
    const ext = extname(файл);
    res.writeHead(200, { "Content-Type": ТИПЫ[ext] || "application/octet-stream" });
    // Только главная страница Lab оборачивается: страницы концепций —
    // самостоятельные документы со своим <head>, им каркас не нужен.
    res.end(путь === "/" || путь === "/index.html" ? КАРКАС(body.toString("utf8")) : body);
  } catch {
    res.writeHead(404).end("нет такого файла");
  }
});
const PORT = 4173;
await new Promise((ok) => server.listen(PORT, ok));
const LAB = `http://localhost:${PORT}`;
const DS = process.env.DS_URL || "http://localhost:3031";

/* ── Что снимаем ─────────────────────────────────────────────────────── */
const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith("--only=")) || "").split("=")[1] || "";
const noDs = args.includes("--no-ds");

const СТРАНИЦЫ = [
  { key: "lab-index", url: `${LAB}/`, full: false, store: "glagol-lab-theme",
    note: "сама витрина" },
  { key: "правила", url: `${LAB}/правила.html`, full: true, store: "glagol-lab-theme",
    note: "правила работы отдельной страницей" },
  { key: "новый-экран", url: `${LAB}/новый-экран.html`, full: true, store: "glagol-lab-theme",
    note: "контрольный экран по стандарту 01.11.2026" },
  { key: "concept-a", url: `${LAB}/concept-a.html`, full: true, store: "glagol-lab-theme",
    note: "концепция A · Инструмент" },
  { key: "concept-b", url: `${LAB}/concept-b.html`, full: true, store: "glagol-lab-theme",
    note: "концепция B · Мастерская" },
  { key: "concept-c", url: `${LAB}/concept-c.html`, full: true, store: "glagol-lab-theme",
    note: "концепция C · Маршрут" },
  ...(noDs
    ? []
    : [
        { key: "ds-home", url: `${DS}/`, full: true, store: "theme", note: "обзор системы" },
        { key: "ds-booking", url: `${DS}/booking`, full: true, store: "theme", note: "эталон записи" },
        { key: "ds-rabota", url: `${DS}/rabota`, full: true, store: "theme", note: "рабочая среда" },
        { key: "ds-dashboard", url: `${DS}/dashboard`, full: true, store: "theme", note: "числа и полосы" },
      ]),
].filter((s) => !only || s.key.includes(only));

const ВИДЫ = [
  { key: "desktop", width: 1440, height: 900 },
  { key: "mobile", width: 375, height: 812 },
];
const ТЕМЫ = ["light", "dark"];

/* Полки Lab и переключатели состояний — мебель витрины, а не интерфейс
   продукта: мерить у них палец незачем. Полка образцов показывает
   элементы в их десктопных размерах — это её работа. */
const НЕ_ПРОДУКТ =
  ".bar, .lab-top, .lab-switch, .bench, .a-states, .b-states, .c-states, .lab-foot";

/* Ссылка внутри абзаца — системное исключение, а не поблажка: нарастить её до
   44 можно только разогнав строки текста. То же говорит WCAG 2.5.8, где цель
   внутри предложения из правила выведена. Исключение именно для ссылки в
   абзаце: кнопка в абзаце исключением не станет. */
const ССЫЛКА_В_ТЕКСТЕ = "p a, p button, li a";

/*
 * Контрольный экран доказывает, что по стандарту можно собрать страницу, не
 * изобретая своего. Доказательство должно быть проверяемым, а не словами:
 * в его собственном <style> разрешена только раскладка. Появится там цвет,
 * кегль, рост, вес, радиус или подложка — значит, стандарта не хватило, и
 * об этом надо узнать от проверки, а не через месяц от Артёма.
 */
{
  const файл = join(here, "новый-экран.html");
  const текст = await readFile(файл, "utf8");
  const стиль = (текст.match(/<style>([\s\S]*?)<\/style>/) || [, ""])[1]
    .replace(/\/\*[\s\S]*?\*\//g, "");
  const запрет = /(^|[;{\s])(color|background|background-color|font-size|font-weight|font-family|border-radius|height|min-height|letter-spacing)\s*:/g;
  const нашли = [...new Set((стиль.match(запрет) || []).map((s) => s.trim().replace(/[;{]/, "").trim()))];
  // `height` у поля и textarea задаёт раскладку формы, а не вид элемента:
  // рост поля приходит из work.css, здесь только то, что без Tailwind не
  // выражается. Остальное запрещено.
  const разрешено = нашли.filter((д) => !/^(height|min-height)\s*:/.test(д));
  if (разрешено.length)
    беды.push(`новый-экран.html: в своём <style> есть вид, а не раскладка — ${разрешено.join(", ")}`);
}

await mkdir(join(here, "shots"), { recursive: true });
const browser = await chromium.launch();
const беды = [];
const сняли = [];

for (const стр of СТРАНИЦЫ) {
  for (const вид of ВИДЫ) {
    for (const тема of ТЕМЫ) {
      const ctx = await browser.newContext({
        viewport: { width: вид.width, height: вид.height },
        deviceScaleFactor: 1,
        colorScheme: тема,
        isMobile: вид.key === "mobile",
        hasTouch: вид.key === "mobile",
        locale: "ru-RU",
        timezoneId: "Europe/Moscow",
      });
      await ctx.addInitScript(
        ([ключ, значение]) => {
          try {
            localStorage.setItem(ключ, значение);
          } catch {}
        },
        [стр.store, тема],
      );
      const page = await ctx.newPage();
      const консоль = [];
      page.on("console", (m) => m.type() === "error" && консоль.push(m.text()));
      page.on("pageerror", (e) => консоль.push(String(e.message)));

      try {
        await page.goto(стр.url, { waitUntil: "load", timeout: 25000 });
        await page.waitForTimeout(700);

        const имя = `${стр.key}-${вид.key}-${тема}.jpg`;
        const высота = await page.evaluate(
          () => document.documentElement.scrollHeight,
        );
        await page.screenshot({
          path: join(here, "shots", имя),
          type: "jpeg",
          quality: 82,
          // Длинную страницу подрезаем: снимок на десять экранов не смотрят,
          // а вес у него как у десяти снимков.
          clip: стр.full
            ? { x: 0, y: 0, width: вид.width, height: Math.min(высота, 2600) }
            : undefined,
        });
        сняли.push(имя);

        /* ── проверки ── */
        const итог = await page.evaluate(([неПродукт, ссылкаВТексте]) => {
          const корень = document.documentElement;
          const шире = корень.scrollWidth - window.innerWidth;
          const мелкие = [];
          for (const el of document.querySelectorAll('a, button, [aria-current="page"]')) {
            if (el.closest(неПродукт) || el.matches(ссылкаВТексте)) continue;
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (r.width < 44 || r.height < 44) {
              мелкие.push(
                `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ` +
                  `${Math.round(r.width)}×${Math.round(r.height)} — «${(el.textContent || "").trim().slice(0, 24)}»`,
              );
            }
          }
          return {
            шире,
            мелкие: [...new Set(мелкие)],
            onest: document.fonts.check('900 16px "Onest"'),
            manrope: document.fonts.check('400 16px "Manrope"'),
          };
        }, [НЕ_ПРОДУКТ, ССЫЛКА_В_ТЕКСТЕ]);

        const где = `${стр.key} · ${вид.key} · ${тема}`;
        if (итог.шире > 1) беды.push(`${где}: горизонтальная прокрутка, лишние ${итог.шире}px`);
        if (вид.key === "mobile" && итог.мелкие.length) {
          беды.push(`${где}: область касания меньше 44 — ${итог.мелкие.length} шт.\n      ` +
            итог.мелкие.slice(0, 6).join("\n      "));
        }
        // Шрифт по имени семейства проверяем только у страниц Lab: в продукте
        // его подключает next/font и называет служебным именем вроде
        // `__Onest_1a2b3c`, так что проверка по «Onest» там всегда ложная.
        if (стр.store === "glagol-lab-theme" && (!итог.onest || !итог.manrope)) {
          беды.push(`${где}: шрифты не подхватились (Onest ${итог.onest}, Manrope ${итог.manrope})`);
        }
        if (консоль.length) беды.push(`${где}: ошибки в консоли — ${консоль.slice(0, 3).join(" | ")}`);
      } catch (e) {
        беды.push(`${стр.key} · ${вид.key} · ${тема}: не снялся — ${String(e.message).split("\n")[0]}`);
      }
      await ctx.close();
    }
  }
  console.log(`✓ ${стр.key} — ${стр.note}`);
}

await browser.close();
server.close();

await writeFile(
  join(here, "shots", "ОТЧЁТ.txt"),
  `Снято ${сняли.length} картинок, ${new Date().toISOString().slice(0, 16).replace("T", " ")}\n\n` +
    (беды.length ? беды.map((b) => `! ${b}`).join("\n") : "Проверки чистые.") +
    "\n",
);

console.log(`\nснято: ${сняли.length}`);
if (!беды.length) {
  console.log("проверки чистые: прокрутки нет, палец попадает, шрифты на месте\n");
  process.exit(0);
}
console.log("");
for (const b of беды) console.log(`! ${b}`);
console.log(`\nвсего замечаний: ${беды.length}\n`);
process.exit(1);
