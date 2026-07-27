// ВНИМАНИЕ: файл скопирован из glagol-calendar/components/select.tsx.
// Править только там и переносить сюда `npm run sync-design` — страница
// эталонов должна показывать ровно то, что работает в продукте.
"use client";

/**
 * Выпадающий список в стиле бюро: пилюля с тонким контуром, небольшой шеврон,
 * меню — карточка с крупным скруглением и галочкой у выбранного.
 *
 * Нативный <select> так оформить нельзя: список рисует операционная система, и
 * на маке он выглядит чужеродно рядом с остальным интерфейсом. Правила и
 * поведение перенесены из панели Дружка (app/panel/Select.tsx): закрытие по
 * клику вне и по Escape, открытие вверх у нижнего края экрана.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = { value: string; label: string };

export function Select({
  value,
  options,
  onChange,
  ariaLabel,
  full,
  compact,
  custom,
}: {
  value: string | number;
  options: Option[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  /**
   * Своё значение под списком: список закрывает девять случаев из десяти,
   * поле — десятый. Задаётся подписью, единицей и границами.
   */
  custom?: { label: string; unit: string; min: number; max: number };
  /** Растянуть на всю ширину (в формах) или оставить по содержимому (пилюлей). */
  full?: boolean;
  /** Узкий вариант для плотных строк расписания. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  // Открывать вверх, если снизу не хватает места: у полей внизу страницы меню
  // иначе уходит за край экрана, и не видно, что выбираешь.
  const [up, setUp] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const current = options.find((o) => String(o.value) === String(value));

  // Показать выбранное сразу: в списке времени 96 пунктов, и открывать его на
  // полуночи, когда выбрано 10:00, — значит заставить человека листать.
  //
  // Прокручиваем само меню, а не через scrollIntoView: тот двигает все
  // прокручиваемые предки, включая страницу. Заметнее всего это когда меню
  // открылось вверх — экран дёргался под курсором (docs/RULES.md).
  const scrollToSelected = useCallback((node: HTMLDivElement | null) => {
    const sel = node?.querySelector<HTMLElement>('[data-selected="1"]');
    if (!node || !sel) return;
    node.scrollTop = sel.offsetTop - node.clientHeight / 2 + sel.offsetHeight / 2;
  }, []);

  function toggle() {
    if (!open && box.current) {
      const r = box.current.getBoundingClientRect();
      const needed = Math.min(options.length * 40 + 12, 320);
      setUp(window.innerHeight - r.bottom < needed && r.top > needed);
    }
    setOpen((v) => !v);
  }

  function applyCustom() {
    if (!custom) return;
    const n = Math.round(Number(draft));
    if (!Number.isFinite(n) || n < custom.min || n > custom.max) return;
    onChange(String(n));
    setDraft("");
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // mousedown, а не click: иначе меню закроется раньше, чем сработает выбор.
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className={cn("relative", full ? "w-full" : "w-fit")}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          // Пилюля с тонким контуром — как в дизайн-системе бюро: высота h-10
          // у всех полей и кнопок, чтобы в ряду ничего не выпирало.
          "flex h-10 items-center justify-between gap-2 rounded-full border border-border bg-card px-4 text-left transition hover:bg-muted",
          full ? "w-full" : "w-fit",
          compact && "px-3 text-sm",
          open && "bg-muted",
        )}
      >
        <span className={cn("truncate", compact && "tabular-nums")}>
          {current?.label ?? (custom ? `${value} ${custom.unit}` : "—")}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted-foreground transition", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          ref={scrollToSelected}
          className={cn(
            // Карточка меню: крупное скругление и «тень v1.3» из правил бюро.
            "absolute z-50 max-h-[320px] min-w-full overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-[0_18px_44px_-22px_rgba(26,26,26,0.34)]",
            up ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {options.map((o) => {
            const on = String(o.value) === String(value);
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                data-selected={on ? "1" : "0"}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={cn(
                  // Выбранное отмечаем галочкой, а не заливкой: в списке из
                  // сотни времён заливка каждой строки рябит.
                  "flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left transition",
                  on ? "font-semibold" : "hover:bg-muted",
                )}
              >
                <span className="truncate">{o.label}</span>
                {on && <Check className="size-4 shrink-0" aria-hidden />}
              </button>
            );
          })}

          {custom && (
            <div className="mt-1 border-t border-border pt-1.5">
              <div className="px-3 pb-1 text-xs text-muted-foreground">{custom.label}</div>
              <div className="flex items-center gap-2 px-1.5 pb-1">
                <input
                  type="number"
                  inputMode="numeric"
                  min={custom.min}
                  max={custom.max}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    applyCustom();
                  }}
                  placeholder={String(value)}
                  className="h-9 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
                />
                <button
                  type="button"
                  onClick={applyCustom}
                  className="h-9 shrink-0 rounded-xl bg-foreground px-3 text-sm font-semibold text-background transition active:scale-95"
                >
                  ОК
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Часы и минуты одним списком — для строк расписания. */
export function timeOptions(step = 15, from = 0, to = 1440): Option[] {
  const out: Option[] = [];
  for (let m = from; m <= to; m += step) {
    if (m === 1440) out.push({ value: String(m), label: "24:00" });
    else out.push({ value: String(m), label: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}` });
  }
  return out;
}
