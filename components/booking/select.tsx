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
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = {
  value: string;
  label: string;
  /**
   * Знак слева от подписи: портрет тренера, значок места.
   *
   * Список людей без лиц читается медленнее списка с лицами — человека узнают
   * по портрету раньше, чем дочитывают имя. Необязательный: у списков этапов и
   * длительностей никаких знаков нет и не нужно.
   */
  icon?: React.ReactNode;
};

export function Select({
  value,
  options,
  onChange,
  small,
  multi,
  values,
  onToggle,
  emptyLabel,
  ariaLabel,
  full,
  compact,
  bare,
  chip,
  tone,
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
  /**
   * Без пилюли — выбор строкой текста.
   *
   * Для фактов вида «менеджер проекта — такой-то»: там рядом стоит подпись
   * в десять пикселей, и пилюля в сорок рядом с ней выглядит вдвое тяжелее
   * самого значения. Список при этом тот же — меняется только вид кнопки.
   */
  bare?: boolean;
  /**
   * Чипом — когда выбор и есть ярлык состояния.
   *
   * Этап спикера и его беда стоят наверху карточки чипами и там же меняются:
   * ярлык, который нельзя нажать, заставляет искать вторую копию себя ниже по
   * экрану, и она там была — отдельным списком в блоке.
   */
  chip?: boolean;
  /** Тон чипа: тот же, что у `work-chip[data-tone]`. */
  tone?: string;
  /**
   * Флажками: выбрано сколько угодно пунктов сразу.
   *
   * Отдельным режимом того же списка, а не вторым компонентом: у отбора по
   * мероприятиям та же пилюля, тот же портал и то же поведение при прокрутке,
   * и вторая копия разошлась бы с этой на первой же правке. Выбранное
   * приходит списком `values`, нажатие отдаётся в `onToggle`, меню при этом не
   * закрывается — иначе три флажка требуют трёх открытий.
   */
  multi?: boolean;
  values?: string[];
  onToggle?: (value: string) => void;
  /** Подпись кнопки, когда не выбрано ничего: «Все мероприятия». */
  emptyLabel?: string;
  /**
   * Мелкий кегль — для рядов отбора.
   *
   * Список стоит в одном ряду с кнопками-пилюлями («Все спикеры»), а у них
   * подпись 13 полужирным. Обычный кегль списка выбивался из строки, и ряд
   * читался как два разных элемента. Кегль меняется и у меню: там те же
   * названия мероприятий, и разный рост одного слова в кнопке и в списке
   * заметен сразу (Артём, 25.08.26).
   */
  small?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  /**
   * Где стоит меню: считаем сами, потому что рисуем его не на своём месте.
   *
   * Меню лежит в конце страницы (портал в `body`) и держится на `fixed`, а
   * значит знает только координаты на экране. Отсюда четыре числа: сверху или
   * снизу от кнопки, слева или справа от неё, и не уже самой кнопки.
   *
   * Вверх — если снизу не хватает места: у полей внизу страницы меню уходило за
   * край, и не видно, что выбираешь. Вправо — если мало места справа: выпадашки
   * стоят в правой части строки спикера, и меню, растущее вправо от своего
   * края, вылезало за лист, а страница вбок не прокручивается.
   */
  const [pos, setPos] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    minWidth: number;
  } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement | null>(null);
  const current = options.find((o) => String(o.value) === String(value));
  const выбраны = values ?? [];
  // Подпись кнопки при флажках: пусто — «все», один — его имя, больше — счёт.
  // Перечислять два-три названия в пилюле нельзя: она растягивает ряд и рвёт
  // строку фильтров на телефоне.
  const подписьМного =
    выбраны.length === 0
      ? (emptyLabel ?? "Все")
      : выбраны.length === 1
        ? (options.find((o) => o.value === выбраны[0])?.label ?? emptyLabel ?? "Все")
        : `${emptyLabel ?? "Выбрано"}: ${выбраны.length}`;

  /**
   * Показать выбранное сразу: в списке времени 96 пунктов, и открывать его на
   * полуночи, когда выбрано 10:00, — значит заставить человека листать.
   *
   * Прокручиваем само меню, а не через scrollIntoView: тот двигает все
   * прокручиваемые предки, включая страницу. Заметнее всего это когда меню
   * открылось вверх — экран дёргался под курсором (docs/RULES.md).
   *
   * Ровно один раз на открытие. Пока это жило в `ref`-обработчике, оно
   * повторялось на каждой перерисовке: React пересоздаёт встроенную функцию
   * ссылки, отцепляет её и цепляет заново — а с ней заново отматывал список к
   * выбранному пункту. Человек тянул список вниз, тот отпрыгивал назад, и это
   * читалось как «прокрутка не работает» (Артём, прод, 19.08.26).
   */
  const держать = useCallback((node: HTMLDivElement | null) => {
    menu.current = node;
  }, []);

  useEffect(() => {
    if (!open) return;
    const node = menu.current;
    const sel = node?.querySelector<HTMLElement>('[data-selected="1"]');
    if (!node || !sel) return;
    node.scrollTop = sel.offsetTop - node.clientHeight / 2 + sel.offsetHeight / 2;
  }, [open]);

  /**
   * Мышью список открывается по нажатию, а не по отпусканию.
   *
   * Кнопка переключала список по `click`, а `click` — это уже отпускание:
   * между нажатием и меню лежала вся длительность нажатия, десятые доли
   * секунды. Само меню строится за десяток миллисекунд, поэтому задержка
   * читалась не как «медленно рисует», а как «не сработало» — и человек жал
   * второй раз, тут же закрывая только что открытое.
   *
   * Так открываются списки в операционной системе: нажал — увидел. Пальцем и с
   * клавиатуры остаётся `click`: на телефоне нажатие ещё не выбор, с него
   * начинается и прокрутка страницы, а у клавиатуры своего `pointerdown` нет
   * вовсе.
   */
  const byMouse = useRef(false);

  /** Померить кнопку и поставить меню рядом с ней. */
  const place = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const needed = Math.min(options.length * 40 + 12, 320);
    const up = window.innerHeight - r.bottom < needed && r.top > needed;
    // Ширина меню — по самому длинному пункту, но не уже кнопки. Точно её не
    // знаем до отрисовки, поэтому берём запас в две ширины кнопки: этого
    // хватает на «Выступление отменено» и «Отказался от подготовки».
    const right = window.innerWidth - r.left < Math.max(r.width * 2, 260);
    setPos({
      minWidth: r.width,
      ...(up ? { bottom: window.innerHeight - r.top + 8 } : { top: r.bottom + 8 }),
      ...(right ? { right: window.innerWidth - r.right } : { left: r.left }),
    });
  }, [options.length]);

  function toggle() {
    if (!open) place();
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
      const t = e.target as Node;
      // Меню лежит вне кнопки — в конце страницы, — поэтому спрашиваем обоих.
      if (box.current?.contains(t) || menu.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    // Страница уехала — меню едет следом: оно держится на координатах экрана, и
    // без этого осталось бы висеть там, где кнопка была раньше. Слушаем с
    // перехватом: прокручивается не только страница, но и карточка спикера.
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    // Прокрутку внутри самого списка пропускаем: меню от неё не уезжает, а
    // пересчёт положения означал бы перерисовку на каждый шаг колеса.
    const onScroll = (e: Event) => {
      if (menu.current && (e.target === menu.current || menu.current.contains(e.target as Node))) return;
      place();
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  return (
    <div ref={box} className={cn("relative", full ? "w-full" : "w-fit")}>
      <button
        type="button"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0) return;
          byMouse.current = true;
          toggle();
        }}
        onClick={(e) => {
          // Мышью список уже открыт нажатием — второй раз не переключаем.
          // У нажатия с клавиатуры `detail` нулевой: там `pointerdown` не было,
          // и закрывать нечего.
          if (byMouse.current && e.detail !== 0) {
            byMouse.current = false;
            return;
          }
          byMouse.current = false;
          toggle();
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        data-tone={chip ? tone : undefined}
        className={cn(
          // Пилюля с тонким контуром — как в дизайн-системе бюро: высота h-9 (36)
          // у всех полей и кнопок, чтобы в ряду ничего не выпирало.
          "flex items-center justify-between gap-2 text-left transition",
          chip
            ? "work-chip"
            : bare
              ? "-mx-1.5 rounded-lg px-1.5 py-0.5 text-sm font-semibold hover:bg-muted"
              : "h-9 rounded-full bg-muted px-4 hover:bg-muted/70",
          full && !chip ? "w-full" : "w-fit",
          compact && !bare && !chip && "px-3 text-sm",
          small && !bare && !chip && "text-[13px] font-bold",
          open && !chip && (bare ? "bg-muted" : "bg-muted/70"),
        )}
      >
        <span className={cn("flex min-w-0 items-center gap-1.5", compact && "tabular-nums")}>
          {current?.icon}
          <span className="truncate">
            {multi ? подписьМного : (current?.label ?? (custom ? `${value} ${custom.unit}` : "—"))}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "shrink-0 transition",
            chip ? "size-3 opacity-70" : "text-muted-foreground",
            bare || chip ? "size-3.5" : "size-4",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {/*
       * Меню рисуется в конце страницы, а не внутри строки.
       *
       * Внутри его накрывали дважды и по разным причинам: сперва соседняя
       * строка со своей прозрачной кнопкой «открыть спикера», потом сама
       * строка — у плитки было сжатие по нажатию (`transform`), а предок с
       * `transform` забирает всё абсолютное внутрь себя и запирает его среди
       * соседей. Оба раза чинилось слоями, и оба раза находилась третья
       * причина: пока меню лежит внутри списка, любой предок может им накрыть.
       *
       * В конце страницы накрывать нечем: над ним только окна согласия и
       * карточка спикера, а он поверх них, потому что открыт последним. Платим
       * за это счётом координат — их считает `place`.
       */}
      {open &&
        pos &&
        createPortal(
          <div
            role="listbox"
            ref={держать}
            style={{ position: "fixed", ...pos }}
            // Карточка меню: крупное скругление и «тень v1.3» из правил бюро.
            // `work-menu` — только чтобы рабочая ветка спрятала полосу
            // прокрутки: правило живёт в `.work`, а сюда, в конец страницы, оно
            // не достаёт.
            className={cn(
              "work-menu z-[60] max-h-[320px] overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-[0_18px_44px_-22px_rgba(26,26,26,0.34)]",
              // Пункты — тем же кеглем, что кнопка списка. Меню рисуется в конце
              // страницы и наследует кегль тела, а не кнопки: у чипа и малого
              // списка пункты выходили крупнее своей кнопки (Артём, 02.09.26).
              (small || chip) && "text-[13px]",
            )}
          >
          {options.map((o) => {
            const on = multi
              ? выбраны.includes(String(o.value))
              : String(o.value) === String(value);
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                data-selected={on ? "1" : "0"}
                onClick={() => {
                  if (multi) {
                    onToggle?.(String(o.value));
                    return;
                  }
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
                <span className="flex min-w-0 items-center gap-1.5">
                  {o.icon}
                  <span className="truncate">{o.label}</span>
                </span>
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
          </div>,
          document.body,
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
