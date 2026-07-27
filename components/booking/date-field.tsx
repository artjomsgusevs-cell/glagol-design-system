// ВНИМАНИЕ: файл скопирован из glagol-calendar/components/date-field.tsx.
// Править только там и переносить сюда `npm run sync-design` — страница
// эталонов должна показывать ровно то, что работает в продукте.
"use client";

/**
 * Выбор даты в стиле бюро.
 *
 * Нативный `<input type="date">` рисует календарь операционной системы: синие
 * акценты, чужие скругления, «Удалить» и «Сегодня» ссылками. Рядом с нашими
 * пилюлями он выглядит вставкой из другого приложения, поэтому календарь свой
 * — тот же, что клиент видит на странице записи: круглые дни, оранжевая
 * заливка выбранного, точка у сегодняшнего.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { humanDate } from "@/lib/booking-format";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

/** YYYY-MM-DD без часовых поясов: календарь работает с датами, а не моментами. */
function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayIso(): string {
  const now = new Date();
  return iso(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function DateField({
  value,
  onChange,
  min,
  placeholder = "Выберите дату",
  ariaLabel,
  clearLabel,
}: {
  /** YYYY-MM-DD или пусто. */
  value: string;
  onChange: (value: string) => void;
  /** Раньше этой даты выбрать нельзя. По умолчанию — сегодня. */
  min?: string;
  placeholder?: string;
  ariaLabel?: string;
  /** Подпись кнопки очистки. Не задана — очистка не показывается. */
  clearLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const today = todayIso();
  const floor = min ?? today;

  // Открываем на месяце выбранной даты, а не на текущем: правя «до 30 сентября»,
  // человек ждёт увидеть сентябрь.
  const [cursor, setCursor] = useState(() => (value || today).slice(0, 7));

  useEffect(() => {
    if (value) setCursor(value.slice(0, 7));
  }, [value]);

  const toggle = useCallback(() => {
    if (!open && box.current) {
      const r = box.current.getBoundingClientRect();
      // Календарь высокий: у нижнего края экрана открываем вверх.
      setUp(window.innerHeight - r.bottom < 340 && r.top > 340);
    }
    setOpen((v) => !v);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const [y, m] = cursor.split("-").map(Number);
  const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7; // пустые клетки до первого числа
  const daysInMonth = new Date(y, m, 0).getDate();
  // Шесть недель всегда: иначе при переключении месяцев поповер меняет
  // высоту и прыгает под курсором.
  const cells: Array<string | null> = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => iso(y, m, i + 1)),
  ];
  while (cells.length < 42) cells.push(null);

  const shift = (delta: number) => {
    const next = new Date(y, m - 1 + delta, 1);
    setCursor(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <div ref={box} className="relative w-fit">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-left text-sm transition hover:bg-muted",
          open && "bg-muted",
        )}
      >
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value ? humanDate(`${value}T12:00:00`) : placeholder}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          className={cn(
            "absolute z-50 w-[280px] rounded-2xl border border-border bg-card p-3 shadow-[0_18px_44px_-22px_rgba(26,26,26,0.34)]",
            up ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label="Прошлый месяц"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted active:scale-95"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="font-display text-sm font-bold">
              {MONTHS[m - 1]} {y}
            </div>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label="Следующий месяц"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted active:scale-95"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-y-0.5 text-center">
            {WEEKDAYS.map((w) => (
              <div key={w} className="pb-1 text-[10px] text-muted-foreground">
                {w}
              </div>
            ))}
            {cells.map((date, i) => {
              // Пустая клетка повторяет обёртку дня — см. календарь записи.
              if (!date) {
                return (
                  <div key={`empty-${i}`} className="flex justify-center py-0.5">
                    <div className="size-8" />
                  </div>
                );
              }
              const disabled = date < floor;
              const active = date === value;
              const isToday = date === today;
              return (
                <div key={date} className="flex justify-center py-0.5">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(date);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex size-8 flex-col items-center justify-center rounded-full text-sm font-semibold tabular-nums transition",
                      active && "bg-primary text-primary-foreground",
                      !active && !disabled && "hover:bg-muted active:scale-90",
                      disabled && "text-muted-foreground/40",
                    )}
                  >
                    {Number(date.slice(-2))}
                    {/* Точка — только сегодня, как в календаре записи. */}
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

          <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
            <button
              type="button"
              onClick={() => {
                onChange(today);
                setOpen(false);
              }}
              className="rounded-full px-3 py-1.5 text-sm font-semibold transition hover:bg-muted"
            >
              Сегодня
            </button>
            {clearLabel && value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {clearLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
