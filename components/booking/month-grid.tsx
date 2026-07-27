// ВНИМАНИЕ: файл скопирован из glagol-calendar/components/month-grid.tsx.
// Править только там и переносить сюда `npm run sync-design` — страница
// эталонов должна показывать ровно то, что работает в продукте.
"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { humanDate as dayLabel } from "@/lib/booking-format";

/**
 * Календарь-месяц и список времени под ним.
 *
 * Перенесён из витрины (booking-flow.tsx) — заказчик должен видеть один и тот
 * же календарь и в мини-аппе бюро, и на личной странице тренера.
 *
 * День не выбирается за пользователя: пока он сам не ткнёт дату, времени нет.
 * Так работает Calendly, и так честнее — иначе кажется, что выбор уже сделан.
 */

export type Slot = { id: string; start: string; end: string };
export type SlotDay = { date: string; slots: Slot[] };

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS_NOM = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
/** «27 июля (вт)» — тот же вид, что в письмах и в кабинете. */
export function humanDate(date: string): string {
  // Полдень, а не полночь: так дата не съезжает на сутки при переводе поясов.
  return dayLabel(new Date(`${date}T12:00:00`));
}

export function MonthGrid({
  days,
  selectedDate,
  onSelectDate,
  className,
}: {
  days: SlotDay[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  /** Для случаев, когда календарь не должен растягиваться по высоте ряда. */
  className?: string;
}) {
  const counts = useMemo(() => new Map(days.map((d) => [d.date, d.slots.length])), [days]);

  // Сегодня — в поясе смотрящего: календарь рисуется у него в браузере, и
  // подсветка должна совпадать с его собственной датой.
  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  const months = useMemo(() => {
    const keys = [...new Set(days.map((d) => d.date.slice(0, 7)))];
    // Даже когда свободных дней нет вовсе, календарь показываем: пустой месяц
    // понятнее, чем пустое место.
    if (keys.length === 0) {
      const now = new Date();
      keys.push(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    }
    return keys.map((key) => {
      const [y, m] = key.split("-").map(Number);
      const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7; // пустые клетки до первого числа
      const daysInMonth = new Date(y, m, 0).getDate();
      const cells: (string | null)[] = Array.from({ length: offset }, () => null);
      for (let d = 1; d <= daysInMonth; d++) {
        cells.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
      }
      // Добиваем до шести недель: в одном месяце их пять, в другом шесть, и
      // при переключении карточка прыгала на высоту целой строки.
      while (cells.length < 42) cells.push(null);
      return { key, title: `${MONTHS_NOM[m - 1]} ${y}`, cells };
    });
  }, [days]);

  const startMonth = Math.max(0, months.findIndex((mo) => mo.key === selectedDate.slice(0, 7)));
  const [monthIdx, setMonthIdx] = useState(startMonth);
  const month = months[Math.min(monthIdx, months.length - 1)];

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-3 sm:p-4", className)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Прошлый месяц"
          disabled={monthIdx === 0}
          onClick={() => setMonthIdx((i) => i - 1)}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition disabled:opacity-25 hover:bg-muted active:scale-95"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="font-display font-bold">{month.title}</div>
        <button
          type="button"
          aria-label="Следующий месяц"
          disabled={monthIdx >= months.length - 1}
          onClick={() => setMonthIdx((i) => i + 1)}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition disabled:opacity-25 hover:bg-muted active:scale-95"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 text-[10px] text-muted-foreground">
            {w}
          </div>
        ))}
        {month.cells.map((date, i) => {
          // Пустая клетка повторяет обёртку дня целиком — вместе с отступами.
          // Иначе последняя строка месяца ниже остальных, и календарь меняет
          // высоту при переключении между месяцами на пять и шесть недель.
          if (!date) {
            return (
              <div key={`empty-${i}`} className="flex justify-center py-0.5">
                <div className="size-10" />
              </div>
            );
          }
          const free = (counts.get(date) ?? 0) > 0;
          const active = date === selectedDate;
          const isToday = date === today;
          return (
            <div key={date} className="flex justify-center py-0.5">
              <button
                type="button"
                disabled={!free}
                onClick={() => onSelectDate(date)}
                className={cn(
                  "flex size-10 flex-col items-center justify-center rounded-full text-[15px] font-semibold tabular-nums transition",
                  active && "bg-primary text-primary-foreground",
                  !active && free && "bg-primary/10 text-primary hover:bg-primary/20 active:scale-90",
                  !free && "text-muted-foreground/40",
                )}
              >
                {Number(date.slice(-2))}
                {/* Точка — только сегодняшний день. Свободные дни и так
                    отличаются заливкой, а точка у каждого читалась как «здесь
                    что-то есть» и сбивала. */}
                <span
                  className={cn(
                    "mt-0.5 h-1 w-1 rounded-full",
                    isToday ? (active ? "bg-primary-foreground" : "bg-primary") : "bg-transparent",
                  )}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Время выбранного дня.
 *
 * Показываем в поясе смотрящего: клиент может быть в другом городе, а «11:00»
 * без пояснения он поймёт как своё время. Поэтому и подпись с поясом рядом.
 */
export function SlotList({
  slots,
  selectedId,
  onSelect,
  timeZone,
}: {
  slots: Slot[];
  selectedId: string;
  onSelect: (id: string) => void;
  timeZone?: string;
}) {
  const fmt = useMemo(
    () => new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone }),
    [timeZone],
  );

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((s) => {
        const active = s.id === selectedId;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={cn(
              "h-11 rounded-xl border text-[15px] font-semibold tabular-nums transition active:scale-95",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/50",
            )}
          >
            {fmt.format(new Date(s.id))}
          </button>
        );
      })}
    </div>
  );
}
