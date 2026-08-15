import Link from "next/link";
import {
  CalendarDays,
  Check,
  Plus,
  Presentation,
  Settings2,
  TriangleAlert,
  X,
} from "lucide-react";
import "./rabota.css";

export const metadata = { title: "Рабочая ветка — элементы" };

/**
 * Витрина элементов рабочей ветки.
 *
 * Показывает не похожие образцы, а тот же самый файл: `app/work.css` приезжает
 * сюда из календаря командой `sync-design` и правится только там. Значит
 * страница не может отстать от продукта незаметно — расхождение поймает
 * сверка, а не глаз через месяц.
 *
 * Разделено на две части, и это не оформление. Оболочка одна на весь продукт и
 * решается один раз: где меню, что в нём, где человек. Содержимое страницы
 * собирается заново на каждом экране. Смешав их в один список, получаешь
 * набор, из которого непонятно, что можно ставить куда угодно, а что стоит
 * там, где стоит.
 */
export default function RabotaPage() {
  return (
    <div className="work min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <div className="work-label">Дизайн-система бюро · v2</div>
        <h1 className="work-title mt-2 text-4xl sm:text-5xl">Рабочая ветка</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Всё, в чём работают каждый день: мероприятия, кабинет тренера, мини-апп.
          Краски берутся из календаря, своими остаются только цвета состояний.
          Правила словами — в{" "}
          <code className="rounded px-1" style={{ background: "var(--paper-deep)" }}>
            RULES_v2.md
          </code>
          , здесь то же самое глазами.
        </p>

        {/* ─────────────── ОБОЛОЧКА ─────────────── */}

        <Part
          name="Интерфейс"
          about="Оболочка одна на весь продукт и решается один раз: где меню, что в нём, где человек. Экран внутри неё меняется, она — нет."
        />

        <Block
          name="Расположение меню"
          job="На десктопе колонка слева: на мыши нижняя капсула — это путь через весь экран к каждому переходу, а слева пункты стоят там же, где их ищут во всех рабочих инструментах. На телефоне наоборот — капсула внизу, до неё дотягивается большой палец, а колонка съела бы пол-экрана. Разметка одна, раскладку делает ширина окна."
        >
          <div className="demo-side">
            <div className="work-side rounded-2xl" style={{ background: "var(--paper-deep)" }}>
              <nav className="work-dock">
                <a aria-current="page">
                  <Presentation className="size-[22px] shrink-0" strokeWidth={2.3} />
                  Мероприятия
                </a>
                <a>
                  <CalendarDays className="size-[22px] shrink-0" strokeWidth={2.3} />
                  Календарь
                </a>
              </nav>
            </div>
            <p className="mt-3 max-w-2xl text-xs" style={{ color: "var(--ink-soft)" }}>
              Это же меню на телефоне становится плавающей капсулой внизу экрана.
              Показать её здесь, на широком окне, можно только переписав ей
              значения — то есть показав то, чего в продукте нет. Поэтому не
              показываем: сузьте окно до 375, и капсула появится сама.
            </p>
          </div>
        </Block>

        <Block
          name="Пункт меню"
          job="Меню не спорит с действием. Текущий пункт обозначают три тихих средства сразу: нейтральная подложка, вес буквы 800 против 500 и фирменный цвет у одной пиктограммы. Подпись остаётся чёрной — цветной текст рядом с цветной кнопкой снова даёт два пятна. Колонка держится в окне, а не тянется во всю длину страницы: иначе человек внизу колонки виден только после прокрутки в конец."
        >
          <div className="flex flex-wrap gap-6 text-xs" style={{ color: "var(--ink-soft)" }}>
            <span>обычный — вес 500, знак серый</span>
            <span>текущий — вес 800, плитка, знак оранжевый</span>
            <span>наведение — подложка плотнее</span>
          </div>
        </Block>

        <Block
          name="Человек"
          job="Стоит последним в колонке: это не раздел продукта, а выход к себе, и искать его будут под всем остальным. Инициалы кругом вместо фотографии — в рабочих экранах лицо не помогает, а место занимает. Значок справа говорит, что строка нажимается; без него карточка читается как подпись."
        >
          <div
            className="flex w-64 items-center gap-2.5 rounded-2xl px-1 py-2.5"
            style={{ background: "var(--paper-deep)" }}
          >
            <span
              className="work-num flex size-9 shrink-0 items-center justify-center rounded-full text-[13px]"
              style={{ background: "var(--paper)", color: "var(--ink-soft)" }}
            >
              АГ
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-bold">Артём Гусев</span>
              <span className="work-label mt-0.5 block">Бюро</span>
            </span>
            <Settings2 className="size-4 shrink-0" style={{ color: "var(--ink-soft)" }} />
          </div>
        </Block>

        {/* ─────────────── СОДЕРЖИМОЕ ─────────────── */}

        <Part
          name="Страницы"
          about="Из этого собирается экран. Каждый элемент отвечает за одну работу — если для новой задачи не находится подходящего, это повод описать задачу, а не завести десятый вид плитки."
        />

        <Block
          name="Заголовки и подписи"
          job="Плакатный заголовок отвечает «куда я попал» до чтения. Мелкая подпись вразрядку говорит «это название поля» и не отнимает внимания у значения. Числа всегда моноширинные: иначе счётчик дёргается при каждом обновлении."
        >
          <div className="space-y-4">
            <div className="work-title text-5xl">Мероприятия</div>
            <div className="work-title text-xl">Спикеры</div>
            <div className="work-label">смета проекта</div>
            <div className="work-num text-4xl">450 000 ₽</div>
          </div>
        </Block>

        <Block
          name="Кнопки"
          job="Четыре на всю ветку, больше не заводим. Главная — действие экрана, сплошной фирменный, одна на экран. Вторая — по важности внутри блока. Мелкая — «добавить» внутри раздела. Тихая — отмена и всё, о чём не жалко забыть."
        >
          <div className="flex flex-wrap items-center gap-3">
            <button className="work-btn work-btn--main">
              <Plus className="size-4" />
              Новое мероприятие
            </button>
            <button className="work-btn work-btn--second">Добавить спикера</button>
            <button className="work-btn work-btn--soft">
              <Plus className="size-3.5" />
              Добавить
            </button>
            <button className="work-btn work-btn--quiet">Отмена</button>
            <button className="work-btn work-btn--main" disabled>
              Создаём…
            </button>
          </div>
          <p className="mt-4 max-w-2xl text-xs" style={{ color: "var(--ink-soft)" }}>
            <b style={{ color: "var(--ink)" }}>Нажимается — отвечает на наведение.</b> Наведите
            курсор: фон становится плотнее. Отклик один на все нажимаемые элементы
            и всегда одного рода — не сдвиг, не тень, не рамка. Сдвиг читается как
            скачок, а тень и рамка меняют размер и двигают соседей.
          </p>
        </Block>

        <Block
          name="Плитка-строка"
          job="Главный элемент списков. Скругление крупное, но не капсула: капсула съедает соседство блоков, и список рассыпается на отдельные пилюли. Подсвечивается при наведении только та, которая правда нажимается, — подсветка обещает переход."
        >
          <div className="space-y-2">
            <a href="#" className="work-tile flex flex-wrap items-center gap-3 p-4">
              <span className="work-dot" data-tone="flame" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold">Мария Ковалёва</div>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  нажимается — при наведении подсвечивается
                </div>
              </div>
              <span className="work-chip">В работе</span>
            </a>
            <div className="work-tile flex items-center gap-3 p-4">
              <span className="work-dot" data-tone="brick" />
              <div className="min-w-0 flex-1">
                <div className="font-semibold">Павел Орлов</div>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  не нажимается — и не подсвечивается
                </div>
              </div>
              <span className="work-chip" data-tone="brick">
                <TriangleAlert className="size-3" />
                На паузе
              </span>
            </div>
          </div>
        </Block>

        <Block
          name="Чипы"
          job="Короткий признак у строки: срок, этап, беда, отметка. Высота одна у всех — разнокалиберные ярлыки в строке выглядят сбоем вёрстки. У нейтрального обводка обязательна: он чаще всего лежит на плитке того же тона и без неё пропадает. Чип-кнопка отвечает на наведение, чип-ярлык — нет."
        >
          <div className="flex flex-wrap gap-2">
            <span className="work-chip">3 из 5</span>
            <button className="work-chip" data-tone="lime">
              <Check className="size-3" />
              Сделано
            </button>
            <span className="work-chip" data-tone="sun">
              Идёт
            </span>
            <span className="work-chip" data-tone="flame">
              Сверх сметы
            </span>
            <span className="work-chip" data-tone="brick">
              Отказался
            </span>
            <button className="work-chip">
              Артём Гусев
              <X className="size-3" />
            </button>
          </div>
        </Block>

        <Block
          name="Точка этапа"
          job="Подпись рядом всё равно есть. Точка нужна, чтобы пробежать колонку глазами и увидеть, где скопление."
        >
          <div className="flex flex-wrap items-center gap-6 text-xs" style={{ color: "var(--ink-soft)" }}>
            {[
              ["", "новый"],
              ["sun", "подготовка"],
              ["flame", "в работе"],
              ["lime", "готово"],
              ["brick", "беда"],
            ].map(([tone, label]) => (
              <span key={label} className="flex items-center gap-2">
                <span className="work-dot" data-tone={tone || undefined} />
                {label}
              </span>
            ))}
          </div>
        </Block>

        <Block
          name="Полоса сметы"
          job="Проведено, назначено вперёд, остаток — тремя отрезками одной строкой, чтобы человек не вычитал в уме. Перерасход не обрезается, а продолжается за сотню полупрозрачным: «вышли за смету» должно быть видно, иначе полоса врёт ровно в том случае, ради которого её смотрят."
        >
          <div className="space-y-5">
            <Bar title="Смета цела" spent={30} planned={0} note="провели 12 ч · осталось 28 ч из 40 ч" />
            <Bar title="Часть назначена вперёд" spent={30} planned={35} note="провели 12 ч · назначено 14 ч · осталось 14 ч" />
            <Bar title="Вышли за смету" spent={70} planned={20} over={18} note="сверх сметы 7 ч" flame />
          </div>
        </Block>

        <Block
          name="Таблица"
          job="Шапка подписью вразрядку, числа моноширинные и по правому краю, рамка одна. Ширины держит table-layout: fixed — иначе колонки пляшут от строки к строке."
        >
          <table className="work-table">
            <thead>
              <tr>
                <th>Тренер</th>
                <th>Встреч</th>
                <th>Часов</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Айрат Мухамедьяров", "4", "6,5"],
                ["Ирина Рогава", "2", "3,0"],
                ["Гала Емец", "1", "1,5"],
              ].map(([name, n, h]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td className="num">{n}</td>
                  <td className="num">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>

        <Block
          name="Пустое состояние"
          job="Отдельным элементом, а не «просто ничего». Пустой экран человек читает как поломку и идёт спрашивать, вместо того чтобы завести первую строчку. Наличие проверяет сторож вёрстки."
        >
          <div className="work-empty px-5 py-8 text-sm" style={{ color: "var(--ink-soft)" }}>
            Мероприятий пока нет. Первое заводится кнопкой наверху — дальше в нём
            появятся спикеры, дедлайны и доступы для заказчика.
          </div>
        </Block>

        <Block
          name="Поля"
          job="Подпись над полем мелкой вразрядку, само поле в цвет листа с волосяной рамкой. Пустое поле — это «не оговаривали», а не ноль."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Название", "Конференция МТС True Tech"],
              ["Смета, часов консультаций", "40"],
            ].map(([label, ph]) => (
              <label key={label} className="block">
                <span className="work-label">{label}</span>
                <input
                  placeholder={ph}
                  className="mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{
                    background: "var(--paper)",
                    color: "var(--ink)",
                    border: "1px solid var(--hairline)",
                  }}
                />
              </label>
            ))}
          </div>
        </Block>

        <p className="mt-16 text-xs" style={{ color: "var(--ink-soft)" }}>
          Элементы приезжают из календаря командой{" "}
          <code className="rounded px-1" style={{ background: "var(--paper-deep)" }}>
            npm run sync-design
          </code>
          . Разошлись с продуктом — это поймает{" "}
          <code className="rounded px-1" style={{ background: "var(--paper-deep)" }}>
            npm run check
          </code>
          , а не глаз через месяц.{" "}
          <Link href="/" className="underline">
            К остальной дизайн-системе
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Раздел витрины: оболочка или содержимое. */
function Part({ name, about }: { name: string; about: string }) {
  return (
    <div className="mt-20 border-t pt-8" style={{ borderColor: "var(--hairline)" }}>
      <h2 className="work-title text-3xl">{name}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        {about}
      </p>
    </div>
  );
}

function Block({
  name,
  job,
  children,
}: {
  name: string;
  job: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h3 className="work-title text-xl">{name}</h3>
      <p className="mt-2 mb-5 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        {job}
      </p>
      {children}
    </section>
  );
}

/** Полоса сметы в трёх положениях: цела, часть назначена вперёд, перерасход. */
function Bar({
  title,
  spent,
  planned,
  over = 0,
  note,
  flame,
}: {
  title: string;
  spent: number;
  planned: number;
  over?: number;
  note: string;
  flame?: boolean;
}) {
  return (
    <div>
      <div className="work-label mb-1.5">{title}</div>
      <div className="work-bar">
        <span className="spent" style={{ width: `${spent}%` }} />
        <span className="planned" style={{ width: `${planned}%` }} />
        {over > 0 && <span className="over" style={{ width: `${over}%` }} />}
      </div>
      <div
        className="mt-1.5 text-xs"
        style={{ color: flame ? "var(--flame)" : "var(--ink-soft)" }}
      >
        {note}
      </div>
    </div>
  );
}
