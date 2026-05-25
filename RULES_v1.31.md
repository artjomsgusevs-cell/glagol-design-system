# glagol-design-system · v1.31 — правила (Rules of the Skin)

> Версия: **1.31** · сборник правил, собранных по итогам реального применения v1.3 в проекте `bureau-portal-v1.3`.
> Это не теоретические guidelines, а **наблюдения за частыми правками пользователя** — то, что нужно делать с первого раза, чтобы не возвращаться.

---

## 1. Типографика

### 1.1 Шрифты
- **Sans (body)**: `Manrope` через `next/font/google` → переменная `--font-sans`.
- **Display (заголовки, числа в KPI)**: `Onest` → переменная `--font-onest`. Класс утилита `font-display`.
- **Legacy/fallback**: `Wix Madefor Display` (`--font-wix`) — оставлен для совместимости со старыми экранами, в новых местах не использовать.
- На странице приложения должен висеть класс `.v13-page` на body/root — он принудительно ставит Manrope и системный sans-serif fallback (`'Helvetica Neue', Arial, sans-serif`).

### 1.2 Знак рубля ₽ — **БЕЗ ЗАСЕЧЕК**
- Onest **не содержит** глиф ₽ — fallback выпадает на serif → выглядит уродливо.
- Правило: ₽ всегда оборачивать в `<span>` с явным sans-стеком:
  ```tsx
  <span style={{ fontFamily: "'Manrope','Helvetica Neue',Arial,sans-serif" }}>₽</span>
  ```
- Утилита `formatMoney(n: number): JSX` возвращает `{разделённое число} {₽-span}`.

### 1.3 Числа
- `tabular-nums` ВСЕГДА для денег, дней, процентов, прогрессов.
- Разряды разделяются **EN SPACE U+2002** (` `) — это шире обычного пробела, выглядит «как в банке». Не использовать `narrow no-break space` U+202F и не ` `.
- Helper: `formatThousands(n: number)` в `src/lib/format.ts`.

### 1.4 Кириллица
- Подписи интерфейса — **русский язык**, никогда не русскоязычная транслитерация и не калька с английского.
- «Дашборд продаж» (а не «Sales»), «Нагрузка тренеров» (а не «Load»).

---

## 2. Цвета и токены

### 2.1 HSL + `<alpha-value>` — ОБЯЗАТЕЛЬНО
- CSS-переменные хранят **HSL тройки без `hsl()`**: `--primary: 18 100% 50%;`
- Tailwind config мапит так: `primary: "hsl(var(--primary) / <alpha-value>)"`.
- Иначе утилиты `bg-primary/10` и `text-primary/60` молча не работают.

### 2.2 Палитра v1.3
| Токен | HSL | Hex | Назначение |
|---|---|---|---|
| `--background` (paper) | `0 0% 96.5%` | `#F6F6F6` | Фон страницы |
| `--card` (surface) | `0 0% 99%` | `#FCFCFC` | Карточки, модалки |
| `--foreground` (ink) | `0 0% 10%` | `#1A1A1A` | Основной текст, hero, primary-кнопка |
| `--muted` | `0 0% 92%` | `#EBEBEB` | Подложки пилюль, нейтральные сегменты |
| `--muted-foreground` | `0 0% 45%` | `#737373` | Подписи, иконки |
| `--primary` | `18 100% 50%` | `#FF5C00` | Только акценты (1–2 точки на экране) |
| `--accent` (peach) | `22 79% 85%` | `#F8CFB8` | **Destructive-кнопки** (НЕ красные!) |
| `--success` | `141 49% 50%` | `#3FBF6A` | Online-индикатор, «одобрить» |
| `--border` | `0 0% 88%` | `#E0E0E0` | Тонкие границы |

### 2.3 Запрет на красный для destructive
- Удалить, отключить, разорвать связь → **peach-фон** (`bg-accent`) + `AlertTriangleIcon` (lucide).
- Красные кнопки не использовать никогда. Только в стектрейсах и валидации формы.

---

## 3. Радиусы, тени, отступы

- Карточки: `rounded-2xl` (16px). Никаких `rounded-xl` в Card.
- Пилюли (pills, badges): `rounded-full`.
- Поля input/select: `rounded-lg` (10–12px), высота **`h-10`** (40px) — стандарт. Кнопки — тоже h-10 для согласования.
- Кнопки-иконки (стрелки, грипперы): `size-7` (28px), `rounded-full`.
- Тени карточек: `shadow-[0_18px_44px_-22px_rgba(26,26,26,0.34)]` — это «v1.3-тень», используем во всех всплывающих/повернутых вверх элементах.
- Hero-блок страницы: `mb-7` (28px) перед stickyBar.

---

## 4. Кнопки

- **Высота** одинаковая: `h-10`. Не h-9, не h-11. Если рядом стоят селект, фильтр и «Сбросить» — все h-10.
- **Primary**: `bg-foreground text-background` (тёмный на светлом — не orange! orange только для редких CTA).
- **Secondary**: `bg-card border border-border text-foreground hover:bg-muted`.
- **Pill-фильтры**: `rounded-full px-3.5 py-1 text-xs font-semibold`. Active state — `bg-card shadow-sm`, остальные — `text-muted-foreground hover:text-foreground`.
- **Destructive**: см. п. 2.3 — peach + AlertTriangle.

---

## 5. Модалки и диалоги

### 5.1 ConfirmDialog — НЕ window.confirm
- `window.confirm/alert` запрещены полностью. Только кастомный `ConfirmDialog` с `tone` (`default | danger`).
- `tone="danger"` → AlertTriangleIcon + peach button.

### 5.2 Modal layout
- Заголовок: `clientCompany · projectName` (через ` · ` U+00B7).
- Тело — **секции** (`<Section title>…</Section>`): Сделка / Формат и место / Финансы / Воркшопы.
- Кнопки внизу: Cancel слева, primary справа. На h-10.
- **Esc** закрывает модалку, но если `isDirty` — показывает sub-confirm «Закрыть без сохранения?».

### 5.3 Inline-редактирование
- Поля для денег: live formatting через `formatMoneyInput` (раздели́ть на лету при вводе).
- Воркшопы: row-editor — клик по строке → раскрывает inline-форму, не отдельная модалка.

---

## 6. MonthPicker (общий компонент для всех страниц)

- Три pill-кнопки: `[anchor, anchor+1, anchor+2]` + стрелки `±1` + popover-год при клике на активную.
- **Фиксированная ширина** pill: `minWidth: 78px; textAlign: center; whiteSpace: nowrap` — иначе «Янв» и «Сентябрь 2027» прыгают.
- **Опциональный `showToday`** — мини-пилюля «Сегодня» с иконкой `CalendarDaysIcon`.
- **Опциональный `onShift`** — если задан, стрелки двигают **активный месяц**, а не окно (для календаря). Если не задан, стрелки двигают только окно pill (для /services).
- Сдвиг лет — через `Math.floor(totalMonths/12)` и `((totalMonths % 12) + 12) % 12` — иначе при отрицательных месяцах год съезжает.

---

## 7. Sidebar

- Ширина: 240px развёрнут / 64px свёрнут. Persist в `localStorage`.
- Клик по лого = коллапс (вместо отдельной кнопки сверху).
- «Свернуть» — кнопка под demo-tag, не плавающая.
- Demo-tag: `⚠ Тестовые данные · 2026`, видна только в раскрытом состоянии.
- Avatar + **зелёная online-точка** (`bg-success`), только у самого аватара, не у имени.
- Logout-кнопка — **на одной строке с аватаром справа**, не отдельным item.
- Items: иконка + лейбл, active state — `bg-card shadow-sm`. В свернутом виде — tooltip справа.

---

## 8. Layout страницы

```
<PageShell>
  <Hero> h1 + description + (optional notice) </Hero>   ← mb-7
  <StickyBar>                                            ← sticky top-0 z-30
    <Filters/MonthPicker/Reset> {/* всё h-10 */}
  </StickyBar>
  <ActionsRow> {/* «Добавить» — отдельной строкой под фильтрами */} </ActionsRow>
  <MainContent>
    <Card>…</Card>
  </MainContent>
</PageShell>
```

**Не смешивать** действия (CTA «Добавить») с фильтрами в одной строке — фильтры sticky, кнопки не должны прилипать.

---

## 9. Таблицы

- Header — `<Th>` eyebrow: `text-xs uppercase tracking-wide text-muted-foreground`.
- Body — `tabular-nums` для числовых колонок, выравнивание `text-right`.
- Wrapper — внутри `<Card>` (rounded-2xl), без двойных рамок.
- Стрелки скролла (`TableScrollArrows`) — поверх скролл-контейнера, не отдельным div.
- DnD строк — отдельный grip-handle (`GripVerticalIcon`) в первой колонке. Клик по строке ≠ drag.

---

## 10. Дашборды (Sales, Load)

### 10.1 KPI hero
- Большие числа: `font-display text-4xl font-extrabold tabular-nums`.
- Подпись сверху: `text-xs uppercase text-muted-foreground tracking-wide`.
- Дельта: `+N` зелёным (`text-success`), `-N` оранжевым (`text-primary`), `0` серым.

### 10.2 Прогресс-бары
- Tri-segment (факт / pre / остаток) — `bg-foreground` / `bg-primary` / `bg-muted`.
- Высота `h-2` для sm, `h-3` для hero.
- Round `rounded-full`, overflow `overflow-hidden`.
- Overflow-визуал при перевыполнении: бар продолжается за 100% полупрозрачным `bg-primary/30`.

### 10.3 Легенда
- Только подписи без значений в sm-варианте (`showLegendValues=false`).
- В hero-варианте — подписи и суммы.

---

## 11. Approval flow

- Регистрация тренера → `approved_at=datetime('now')` сразу.
- Регистрация админа/продавца → `approved_at=NULL`, в админке появляется pill `ждёт` (оранжевая).
- Один раз нажать «✓ Одобрить доступ» (зелёная кнопка в UserEditModal) → выставить `approved_at` + (опционально) `sendApprovalEmail` через nodemailer (best-effort, не блокирует).
- Пока не одобрен — `PendingApprovalScreen` placeholder (вместо контента).

---

## 12. Доступы (RBAC)

- `sales` НЕ видит `/sales` и `/admin` (это головные).
- `trainer` видит только `/calendar` + `/profile` (можно `/load` в read-only с фильтром «я»).
- `head` / `lead` видят всё.
- Sidebar фильтрует пункты через `isAdminRole(user.role)` — не через `role !== "trainer"`.

---

## 13. Демо-режим

- Demo-tag в sidebar + (опционально) notice-blok в hero страницы: «⚠ Май 2026 — демо-данные».
- В тексте notice — реальный текущий месяц (не хардкод).

---

## 14. Иконки

- **lucide-react v1.16.0** (форк) — все иконки оттуда.
- Размеры: `size-3` (12) для inline в pill, `size-4` (16) стандарт, `size-5` (20) для hero-индикаторов.
- В свёрнутом sidebar — `size-5`.

---

## 15. Чек-лист «что я обычно прошу переделать»

> Если после первого захода написал любую из этих фраз — это нарушение правил выше:

1. «₽ с засечками» → §1.2
2. «Кнопки разной высоты» → §4
3. «Красная кнопка удалить» → §2.3 / §5.1
4. «window.confirm выскакивает» → §5.1
5. «Скачут при переключении» (pills, кнопки) → §6 fixed width
6. «Прыжки обратно» при перелистывании месяца → §6 onShift sync
7. «Свернуть в боковом меню скачет» → §7
8. «sales видит дашборд продаж» → §12
9. «Карточка модалки без секций» → §5.2
10. «Цифры без пробелов» / «обычный пробел вместо EN-space» → §1.3
11. «bg-primary/10 не работает» → §2.1 HSL+alpha
12. «Двойная рамка у таблицы внутри Card» → §9

---

## Автотесты

Smoke-test расположен в `bureau-portal-v1.3/scripts/smoke-test.ts`:

```bash
npm run test:smoke
```

Проверяет, что все ключевые роуты отдают 2xx/3xx и не содержат runtime-ошибок Next.js в HTML.

В будущем добавить:
- visual regression (Playwright screenshot diff) для главных страниц
- проверка a11y axe на каждой странице
- e2e flow: register → approval → login → создать проект

---

_Версия выпущена: 25 мая 2026 · автор правил: artemgusev@glagol.me_
