# Глагол · Дизайн-система v1.2

Статичная страница с полной выкладкой дизайн-системы внутреннего портала бюро Глагол:
цвета, типографика, радиусы, тени, кнопки, инпуты, статус-пилюли, таблицы, календарь,
модалы, toast, hero-блок и CSS-токены.

Источник правды — `src/app/globals.css` основного проекта (репо `bureau-calendar`).
Здесь — только зеркало, удобное для деплоя без Next.js и БД.

## Деплой на Vercel

Никаких зависимостей, БД и env-переменных — просто статический `index.html`.

### Вариант A · через web UI (без CLI)

1. Открой https://vercel.com/new
2. Выбери **Import** → **Browse** или просто перетащи папку `glagol-design-system/` в зону загрузки.
3. Framework Preset: **Other** (Vercel сам определит как статику).
4. **Deploy** — через 5 секунд страница будет доступна по `https://<имя-проекта>.vercel.app/`.

### Вариант B · через CLI

```bash
npm i -g vercel
cd ~/Documents/glagol-design-system
vercel --prod
```

### Вариант C · через GitHub

```bash
gh repo create glagol-design-system --public --source=. --push
```

Затем импортнуть в Vercel через https://vercel.com/new.

## Локально

Просто открой `index.html` в браузере (двойной клик) — никакого сервера не нужно.
