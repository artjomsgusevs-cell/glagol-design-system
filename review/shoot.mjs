/**
 * Снимки и проверки страницы сверки.
 *
 *   node review/shoot.mjs
 *
 * Четыре вида: 1440 и 375, светлая и тёмная. Меньше нельзя — половина
 * расхождений этой страницы живёт в тёмной теме, а вторая половина
 * проверяется только на телефонной ширине.
 *
 * Токены и краски рабочей среды лежат в `lab/` — их собирает `lab/build.mjs`
 * из файлов продукта. Второй копии здесь нет и быть не должно: сервер просто
 * отдаёт их из соседней папки, а при публикации они кладутся рядом со
 * страницей теми же файлами.
 *
 * Playwright берём у атласа: второй установки браузера в бюро не заводим.
 */
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
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

/* Тот же каркас, в который артефакт оборачивает страницу при публикации. */
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
};

const server = createServer(async (req, res) => {
  const путь = decodeURIComponent(req.url.split("?")[0]);
  const имя = путь === "/" ? "index.html" : путь.replace(/^\//, "");
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
const PORT = 4174;
await new Promise((ok) => server.listen(PORT, ok));

const ВИДЫ = [
  { key: "desktop", width: 1440, height: 900 },
  { key: "mobile", width: 375, height: 812 },
];

/* Верхняя полоса сверки — мебель страницы, а не интерфейс продукта. Сцены с
   образцами показывают элементы в их настоящих размерах: мерить у них палец
   незачем, в этом вся суть разбора.

   Ссылка внутри абзаца — системное исключение, а не поблажка: нарастить её до
   44 можно только разогнав строки текста, и то же самое говорит WCAG 2.5.8,
   где цель внутри предложения из правила выведена. Исключение именно для
   ссылки в абзаце: кнопка в абзаце исключением не станет. */
const НЕ_ПРОДУКТ = ".св-верх, .св-тумблер, .сцена, .св-оглавление";
const ССЫЛКА_В_ТЕКСТЕ = ".св p > a, .реко a, .р-суть a";

await mkdir(join(here, "shots"), { recursive: true });
const browser = await chromium.launch();
const беды = [];
const сняли = [];

for (const вид of ВИДЫ) {
  for (const тема of ["light", "dark"]) {
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
      ["glagol-review-theme", тема],
    );
    const page = await ctx.newPage();
    const консоль = [];
    page.on("console", (m) => m.type() === "error" && консоль.push(m.text()));
    page.on("pageerror", (e) => консоль.push(String(e.message)));

    try {
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: "load", timeout: 25000 });
      await page.waitForTimeout(800);

      const имя = `сверка-${вид.key}-${тема}.jpg`;
      const высота = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.screenshot({
        path: join(here, "shots", имя),
        type: "jpeg",
        quality: 82,
        clip: { x: 0, y: 0, width: вид.width, height: Math.min(высота, 2600) },
      });
      сняли.push(имя);

      const итог = await page.evaluate(([неПродукт, ссылкаВТексте]) => {
        const корень = document.documentElement;
        const мелкие = [];
        for (const el of document.querySelectorAll("a, button")) {
          if (el.closest(неПродукт) || el.matches(ссылкаВТексте)) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.width < 44 || r.height < 44)
            мелкие.push(
              `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ` +
                `${Math.round(r.width)}×${Math.round(r.height)} — «${(el.textContent || "").trim().slice(0, 24)}»`,
            );
        }
        // Ширину меряем по телу: карточки и таблицы могут прокручиваться сами,
        // а вот страница целиком — не должна.
        return {
          шире: корень.scrollWidth - window.innerWidth,
          мелкие: [...new Set(мелкие)],
          onest: document.fonts.check('900 16px "Onest"'),
          manrope: document.fonts.check('400 16px "Manrope"'),
          тёмная: корень.classList.contains("dark"),
          кнопок: document.querySelectorAll(".сцена button").length,
        };
      }, [НЕ_ПРОДУКТ, ССЫЛКА_В_ТЕКСТЕ]);

      const где = `${вид.key} · ${тема}`;
      if (итог.шире > 1) беды.push(`${где}: горизонтальная прокрутка, лишние ${итог.шире}px`);
      if (вид.key === "mobile" && итог.мелкие.length)
        беды.push(
          `${где}: область касания меньше 44 вне сцен — ${итог.мелкие.length} шт.\n      ` +
            итог.мелкие.slice(0, 6).join("\n      "),
        );
      if (!итог.onest || !итог.manrope)
        беды.push(`${где}: шрифты не подхватились (Onest ${итог.onest}, Manrope ${итог.manrope})`);
      if (итог.тёмная !== (тема === "dark"))
        беды.push(`${где}: тема не применилась, класс dark = ${итог.тёмная}`);
      if (итог.кнопок < 20) беды.push(`${где}: образцов на сценах всего ${итог.кнопок} — страница недоехала`);
      if (консоль.length) беды.push(`${где}: ошибки в консоли — ${консоль.slice(0, 3).join(" | ")}`);
    } catch (e) {
      беды.push(`${вид.key} · ${тема}: не снялся — ${String(e.message).split("\n")[0]}`);
    }
    await ctx.close();
  }
  console.log(`✓ ${вид.key}`);
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
  console.log("проверки чистые\n");
  process.exit(0);
}
console.log("");
for (const b of беды) console.log(`! ${b}`);
console.log(`\nвсего замечаний: ${беды.length}\n`);
process.exit(1);
