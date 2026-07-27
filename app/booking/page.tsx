"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  Check,
  Clock,
  CreditCard,
  Globe,
  Loader2,
  Mail,
  Video,
  X,
} from "lucide-react";
import { PageShell, PageHeader } from "@/components/page-shell";
import { Eyebrow, H3, Small } from "@/components/typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonthGrid, SlotList, type SlotDay } from "@/components/booking/month-grid";
import { DateField } from "@/components/booking/date-field";
import { Select } from "@/components/booking/select";
import { Step } from "@/components/booking/step";
import { CopyLink } from "@/components/booking/copy-link";
import { TrainerAvatar } from "@/components/booking/trainer-avatar";
import { humanDateTime } from "@/lib/booking-format";
import { cn } from "@/lib/utils";

/* =========================================================
   Календарь тренеров · эталон
   Живые элементы продукта calendar.glagol.me, а не картинки.
   Файлы в components/booking/ — копии из glagol-calendar,
   переносятся `npm run sync-design`. Правим там, не здесь.
   ========================================================= */

/** Подпись под образцом: чем он живёт в продукте. */
function Spec({ file, rule }: { file: string; rule?: string }) {
  return (
    <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
      <code className="bg-muted rounded px-1.5 py-0.5">{file}</code>
      {rule && <span>{rule}</span>}
    </div>
  );
}

/** Ряд состояний одного элемента с подписью под каждым. */
function States({ items }: { items: Array<{ label: string; node: React.ReactNode }> }) {
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col items-center gap-2">
          {it.node}
          <Small className="text-muted-foreground">{it.label}</Small>
        </div>
      ))}
    </div>
  );
}

/* ── демо-данные ────────────────────────────────────────── */

const TODAY = new Date();
const day = (offset: number) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const slotsFor = (date: string, times: string[]): SlotDay => ({
  date,
  slots: times.map((t) => ({
    id: `${date}T${t}:00.000Z`,
    start: t,
    end: t,
  })),
});

const DAYS: SlotDay[] = [
  slotsFor(day(1), ["10:00", "11:00", "12:00"]),
  slotsFor(day(2), ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]),
  slotsFor(day(3), ["10:00", "14:00"]),
  slotsFor(day(6), ["10:00", "11:00"]),
];

const DURATIONS = [15, 20, 30, 45, 50, 60, 90].map((d) => ({
  value: String(d),
  label: `${d} минут`,
}));

/**
 * Экран после записи — образец обоих состояний.
 *
 * Один компонент на оба намеренно: расходиться им нельзя нигде, кроме главного
 * действия. Появится третий вход (бот, партнёрская страница) — он собирается
 * отсюда же, а не рисуется заново.
 */
function DoneScreen({ action }: { action: "manage" | "brief" }) {
  return (
    <div className="bg-card border-border mx-auto w-full max-w-[420px] rounded-3xl border p-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-full">
          <Check className="text-primary size-6" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-xl leading-tight font-extrabold tracking-tight">
            Время забронировано
          </h1>
          <p className="text-muted-foreground truncate text-sm">Консультация · Артём Гусев</p>
        </div>
      </div>

      <div className="bg-muted mt-6 rounded-2xl px-4 py-3.5">
        <div className="font-display text-lg font-extrabold tabular-nums">30 июля (чт), 15:00</div>
        <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-sm tabular-nums">
          <Clock className="size-3.5" />
          60 минут · Москва
        </div>
      </div>

      <ol className="mt-6 space-y-4">
        <Step icon={<Mail className="size-4" />} title="Приглашение отправлено">
          Оно уже в вашем календаре и на почте artjom@example.com. Ссылка на звонок внутри.
        </Step>
        <Step icon={<Video className="size-4" />} title="Где встречаемся">
          <span className="text-primary break-words">us02web.zoom.us/j/8398564201</span>
        </Step>
        <Step icon={<CalendarClock className="size-4" />} title="Если планы изменятся">
          Перенести или отменить можно кнопкой ниже — она только ваша. Эта же ссылка лежит в
          описании встречи в календаре.
        </Step>
      </ol>

      {action === "brief" ? (
        <div className="border-border mt-6 border-t pt-5">
          <div className="text-sm font-semibold">Расскажите о выступлении подробнее</div>
          <p className="text-muted-foreground mt-1 text-sm leading-snug">
            Пять минут сейчас — и тренер придёт на встречу, уже зная вашу задачу.
          </p>
          <span className="bg-primary text-primary-foreground mt-3 flex h-12 w-full items-center justify-center rounded-full font-semibold">
            Заполнить бриф
          </span>
          <span className="text-muted-foreground mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold">
            <CalendarClock className="size-4" />
            Управлять бронированием
          </span>
        </div>
      ) : (
        <div className="border-border mt-6 space-y-3 border-t pt-5">
          <span className="bg-foreground text-background flex h-12 w-full items-center justify-center gap-2 rounded-full font-semibold">
            <CalendarClock className="size-5" />
            Управлять записью
          </span>
          <span className="bg-muted flex h-11 w-full items-center justify-center gap-2 rounded-full font-semibold">
            <CalendarPlus className="size-5" />
            Добавить в календарь
          </span>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  const [selected, setSelected] = React.useState(DAYS[1].date);
  const [slot, setSlot] = React.useState("");
  const [date, setDate] = React.useState("");
  const [duration, setDuration] = React.useState("50");
  const [place, setPlace] = React.useState("online");
  const [copied, setCopied] = React.useState(false);

  const dayNow = DAYS.find((d) => d.date === selected);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Календарь тренеров · эталон"
        title="Календарь тренеров"
        description="Живые элементы продукта, а не картинки. Открывайте рядом со своим экраном и сверяйте: если что-то расходится — прав этот файл."
        actions={
          <>
            <Button asChild size="sm">
              <a href="https://calendar.glagol.me/agusev" target="_blank" rel="noreferrer">
                Открыть продукт
              </a>
            </Button>
          </>
        }
      />

      {/* ── как сверять ───────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Как этим пользоваться</CardTitle>
              <CardDescription>
                Страница нужна, чтобы система не расползалась: в продукте и здесь один и тот же код.
              </CardDescription>
            </div>
            <Badge variant="secondary">Срез продукта · {humanDateTime(TODAY).split(",")[0]}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <Step icon={<Check className="size-4" />} title="Под каждым образцом — адрес">
              Написано, каким файлом продукта он живёт. Расходится вид — правьте продукт, а не эталон.
            </Step>
            <Step icon={<Check className="size-4" />} title="Состояния показаны все">
              Если у вас нет состояния, которое здесь есть, — оно потерялось при переносе.
            </Step>
            <Step icon={<Check className="size-4" />} title="Эталон обновляют из продукта">
              <code className="bg-muted rounded px-1 py-0.5 text-xs">npm run sync-design</code> в
              glagol-calendar. Обратного направления нет: эталон, который правили руками, перестаёт
              быть эталоном.
            </Step>
          </ul>
        </CardContent>
      </Card>

      <div className="section-rule">
        <span>
          <b>01</b> · Экран после записи
        </span>
      </div>

      {/* ── экран после записи: два состояния ─────────────── */}
      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Экран после записи</CardTitle>
            <CardDescription>
              Стандарт бюро. Любой новый финальный экран — оплата, отмена, перенос — собирается по
              этой же схеме: что произошло → когда → что дальше → одно главное действие. Состояния
              отличаются ровно одним: каким будет это действие.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Eyebrow tone="muted">Со страницы тренера</Eyebrow>
              <div className="bg-muted/40 mt-2 rounded-3xl p-4 sm:p-6">
                <DoneScreen action="manage" />
              </div>
              <Spec
                file="app/[slug]/[type]/booking-flow.tsx · Done"
                rule="Главное действие чёрное. Оранжевого на этом экране нет: событие уже случилось."
              />
            </div>

            <div>
              <Eyebrow tone="muted">Из витрины бюро — первая встреча</Eyebrow>
              <div className="bg-muted/40 mt-2 rounded-3xl p-4 sm:p-6">
                <DoneScreen action="brief" />
              </div>
              <Spec
                file="app/trainers/[slug]/booking/booking-flow.tsx · DoneStep"
                rule="Единственное место, где главное действие оранжевое: бриф первой встречи экономит полчаса на самой консультации."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Из чего он собран</CardTitle>
            <CardDescription>Порядок блоков — часть стандарта, менять его не нужно.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["1 · Что произошло", "Галочка в кружке и заголовок в одну строку. Ниже — тип встречи и тренер."],
              ["2 · Когда", "Единственная заливка на экране, поэтому глаз находит время первым."],
              ["3 · Что дальше", "Три строки: приглашение отправлено, где встречаемся, если планы изменятся. Не больше."],
              ["4 · Действие", "Одно главное действие, отбитое разделителем. Вторичное — под ним, без заливки."],
              ["5 · Подвал", "Знак бюро и документы. Уводит на сайт с utm-метками."],
            ].map(([title, text]) => (
              <div key={title}>
                <Eyebrow tone="muted">{title}</Eyebrow>
                <p className="text-muted-foreground mt-1 text-sm">{text}</p>
              </div>
            ))}
            <div className="border-border border-t pt-4">
              <Eyebrow tone="muted">Что убрали и почему</Eyebrow>
              <p className="text-muted-foreground mt-1 text-sm">
                Ссылку с копированием: она вела туда же, куда кнопка над ней, и была третьим
                оранжевым пятном. Прошлые версии — в{" "}
                <Link href="/archive" className="text-foreground font-semibold underline-offset-4 hover:underline">
                  архиве
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="section-rule">
        <span>
          <b>02</b> · Календарь и время
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Календарь месяца</CardTitle>
            <CardDescription>
              Один и тот же календарь на странице записи, в переносе и в поле даты. Другого в
              продукте быть не должно.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthGrid days={DAYS} selectedDate={selected} onSelectDate={setSelected} />
            <Spec
              file="components/month-grid.tsx"
              rule="Всегда 42 клетки. Пустая повторяет обёртку дня — иначе последняя строка схлопывается и высота пляшет при смене месяца."
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Время</CardTitle>
            <CardDescription>
              Свободные окна выбранного дня. Список прокручивается внутри себя — страница при этом
              стоит на месте.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[260px] overflow-y-auto pr-1">
              <SlotList
                slots={dayNow?.slots ?? []}
                selectedId={slot}
                onSelect={setSlot}
                timeZone="Europe/Moscow"
              />
            </div>
            <Spec file="components/month-grid.tsx · SlotList" />

            <div className="mt-6">
              <Eyebrow tone="muted">Пустые состояния</Eyebrow>
              <div className="mt-2 space-y-2">
                <div className="border-border text-muted-foreground rounded-2xl border border-dashed p-4 text-center text-sm">
                  Свободного времени сейчас нет. Напишите тренеру — договоритесь напрямую.
                </div>
                <div className="text-muted-foreground py-4 text-center text-sm">Выберите день</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="section-rule">
        <span>
          <b>03</b> · Поля и списки
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Выбор даты</CardTitle>
            <CardDescription>
              Нативный <code className="bg-muted rounded px-1">input type=&quot;date&quot;</code>{" "}
              рисует календарь операционной системы — рядом с нашими пилюлями это вставка из чужого
              приложения.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <States
              items={[
                {
                  label: "Пусто",
                  node: <DateField value="" onChange={() => {}} placeholder="Бессрочно" />,
                },
                {
                  label: "Выбрано",
                  node: (
                    <DateField
                      value={date || day(14)}
                      onChange={setDate}
                      clearLabel="Снять срок"
                    />
                  ),
                },
              ]}
            />
            <Spec file="components/date-field.tsx" rule="Внутри — тот же календарь, что на записи." />
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Выпадающий список</CardTitle>
            <CardDescription>
              Список закрывает девять случаев из десяти, поле «Своё значение» — десятый.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-6">
              <div className="w-[220px]">
                <Small className="text-muted-foreground">Обычный</Small>
                <div className="mt-1">
                  <Select
                    full
                    value={duration}
                    options={DURATIONS}
                    onChange={setDuration}
                    ariaLabel="Длительность"
                    custom={{ label: "Своя длительность", unit: "минут", min: 5, max: 480 }}
                  />
                </div>
              </div>
              <div>
                <Small className="text-muted-foreground">Плотный</Small>
                <div className="mt-1">
                  <Select
                    compact
                    value="600"
                    options={[
                      { value: "600", label: "10:00" },
                      { value: "660", label: "11:00" },
                    ]}
                    onChange={() => {}}
                    ariaLabel="Время"
                  />
                </div>
              </div>
            </div>
            <Spec
              file="components/select.tsx"
              rule="Меню рисуется поверх и не двигает страницу. Прокрутка к выбранному — node.scrollTop, не scrollIntoView."
            />
          </CardContent>
        </Card>
      </div>

      <div className="section-rule">
        <span>
          <b>04</b> · Кнопки и размеры
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Иерархия кнопок</CardTitle>
            <CardDescription>
              Отмена персиковая, не красная: красная кнопка пугает сильнее, чем стоит поступок,
              который всегда можно повторить.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <States
              items={[
                {
                  label: "Главное",
                  node: (
                    <span className="bg-foreground text-background flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold">
                      <CalendarClock className="size-4" />
                      Перенести
                    </span>
                  ),
                },
                {
                  label: "Оплата",
                  node: (
                    <span className="bg-primary text-primary-foreground flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold">
                      <CreditCard className="size-4" />
                      Оплатить 15 000 ₽
                    </span>
                  ),
                },
                {
                  label: "Вторичное",
                  node: (
                    <span className="bg-muted flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold">
                      <CalendarPlus className="size-4" />
                      В календарь
                    </span>
                  ),
                },
                {
                  label: "Отмена",
                  node: (
                    <span className="bg-accent flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold">
                      <X className="size-4" />
                      Отменить встречу
                    </span>
                  ),
                },
                {
                  label: "В работе",
                  node: (
                    <span className="bg-primary text-primary-foreground flex h-11 items-center justify-center rounded-full px-5">
                      <Loader2 className="size-4 animate-spin" />
                    </span>
                  ),
                },
              ]}
            />
            <Spec file="app/[slug]/[type]/booking-flow.tsx · app/b/[token]/manage-booking.tsx" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Высоты</CardTitle>
            <CardDescription>
              Внутри одного ряда высоты обязаны совпадать. Между рядами могут отличаться — но только
              по этому списку.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["h-10", "поля, пилюли, выпадающие списки"],
              ["h-11", "кнопки времени и вторичные действия"],
              ["h-12", "главное действие на экране"],
            ].map(([h, what]) => (
              <div key={h} className="flex items-center gap-3">
                <span
                  className={cn(
                    "bg-muted flex items-center justify-center rounded-full px-4 text-xs font-semibold",
                    h === "h-10" && "h-10",
                    h === "h-11" && "h-11",
                    h === "h-12" && "h-12",
                  )}
                >
                  {h}
                </span>
                <Small className="text-muted-foreground">{what}</Small>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="section-rule">
        <span>
          <b>05</b> · Строки и блоки
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Строка «что дальше»</CardTitle>
            <CardDescription>
              Одни и те же слова на экране после записи и на странице управления. Разные
              формулировки об одном читаются как разные состояния.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <Step icon={<Check className="size-4" />} title="Встреча подтверждена">
                Она уже в вашем календаре и в календаре тренера — приглашение отправлено на почту.
              </Step>
              <Step icon={<Globe className="size-4" />} title="Часовой пояс">
                Пояс передаём явно: у тренера в Екатеринбурге и клиента в Москве это разное время.
              </Step>
            </ul>
            <Spec file="components/step.tsx" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Ссылка с копированием</CardTitle>
            <CardDescription>
              Ширина кнопки прибита: иначе строка дёргается на слове «Скопировано».
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyLink url="https://calendar.glagol.me/agusev" />
            <CopyLink url="https://calendar.glagol.me/b/1a739d693a…" compact />
            <Spec file="components/copy-link.tsx" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Карточка встречи</CardTitle>
            <CardDescription>Список в кабинете тренера: время, тип, клиент.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="border-border bg-card rounded-2xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold">30 июля (чт), 15:00</div>
                  <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <Clock className="size-3.5" />
                    Консультация
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="font-medium">Иван Петров</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Mail className="size-3.5" />
                    ivan@example.com
                  </span>
                </div>
              </li>
            </ul>
            <Spec file="app/app/meeting-card.tsx" rule="Без двойных рамок: карточка одна." />
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>Тренер</CardTitle>
            <CardDescription>Аватар с запасным вариантом из инициалов.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <TrainerAvatar id="agusev" name="Артём Гусев" size={48} />
              <TrainerAvatar id="venera" name="Венера Шакирова" size={40} />
              <TrainerAvatar id="andrey" name="Андрей Суворков" size={32} />
            </div>
            <Spec file="components/trainer-avatar.tsx" />
          </CardContent>
        </Card>
      </div>

      <div className="section-rule">
        <span>
          <b>06</b> · Тексты
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Так и не так</CardTitle>
          <CardDescription>
            Правила из docs/RULES.md продукта. Слева — как пишем, справа — как не пишем.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr_1fr] gap-x-6 gap-y-3 text-sm">
            <Eyebrow tone="muted">Так</Eyebrow>
            <Eyebrow tone="muted">Не так</Eyebrow>
            {[
              ["27 июля (вт), 17:00", "27.07 17:00"],
              ["Не позднее чем за 2 часа", "Не позже чем за 2 часа"],
              ["Zoom", "видеовстреча"],
              ["Час", "час — в пунктах списка"],
              ["Отменить встречу", "Удалить"],
            ].map(([good, bad]) => (
              <React.Fragment key={good}>
                <div className="tabular-nums">{good}</div>
                <div className="text-muted-foreground line-through decoration-1">{bad}</div>
              </React.Fragment>
            ))}
          </div>
          <Spec file="docs/RULES.md · lib/format.ts · lib/place.ts" />
        </CardContent>
      </Card>

      <div className="section-rule">
        <span>
          <b>07</b> · Ничего не скачет
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Условное поле держит своё место</CardTitle>
          <CardDescription>
            Переключите место встречи: подпись меняется, высота — нет. Раньше выбор «Очно» выдвигал
            новое поле и вся форма ниже уезжала.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-3">
            <Select
              full
              value={place}
              options={[
                { value: "online", label: "Zoom — ваша комната" },
                { value: "link", label: "Своя ссылка — Телемост, Мит, что угодно" },
                { value: "offline", label: "Очно — по адресу" },
              ]}
              onChange={setPlace}
              ariaLabel="Место встречи"
            />
            <label className="block">
              <span className="text-sm font-medium">
                {place === "offline" ? "Адрес" : "Ссылка на встречу"}
              </span>
              {place === "online" ? (
                <div className="bg-muted text-muted-foreground mt-1 flex h-11 items-center rounded-xl px-3 text-sm">
                  Подставим сами: встречу создаст Zoom.
                </div>
              ) : (
                <input
                  readOnly
                  placeholder={
                    place === "offline" ? "Москва, Хохловский пер., 7" : "https://telemost.yandex.ru/j/…"
                  }
                  className="border-input bg-background focus-visible:border-ring mt-1 h-11 w-full rounded-xl border px-3 outline-none"
                />
              )}
              <span className="text-muted-foreground mt-1 block min-h-[1rem] text-xs">
                {place === "link" && "Телемост, Мит, Контур.Толк — любая постоянная комната."}
              </span>
            </label>
          </div>
          <Spec
            file="app/app/events/events-screen.tsx"
            rule="Приёмка — замер getBoundingClientRect() до и после действия: top и height не меняются."
          />
        </CardContent>
      </Card>

      <div className="text-muted-foreground mt-10 text-center text-sm">
        Правим в{" "}
        <code className="bg-muted rounded px-1">glagol-calendar</code>, переносим сюда{" "}
        <code className="bg-muted rounded px-1">npm run sync-design</code>. Эталон, который правили
        руками, перестаёт быть эталоном.
      </div>
    </PageShell>
  );
}
