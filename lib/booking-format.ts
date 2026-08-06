// ВНИМАНИЕ: файл скопирован из glagol-calendar/lib/format.ts.
// Править только там и переносить сюда `npm run sync-design` — страница
// эталонов должна показывать ровно то, что работает в продукте.
/**
 * Дата и время в одном виде на всех экранах: «27 июля (вт), 17:00».
 *
 * Раньше каждый экран форматировал по-своему: где-то «понедельник, 27 июля в
 * 11:00», где-то «27 июл. 11:00». Человек читает письмо, потом открывает
 * страницу — и каждый раз заново разбирается, что перед ним. День недели в
 * скобках нужен всегда: время встречи проверяют именно по нему.
 *
 * Часовой пояс передаём явно. По умолчанию `Intl` берёт пояс браузера, а у
 * тренера в Екатеринбурге и клиента в Москве это разное время — молчаливая
 * подстановка тут обернулась бы пропущенной встречей.
 */

const cache = new Map<string, Intl.DateTimeFormat>();

function fmt(tz: string | undefined, opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${tz ?? ""}|${JSON.stringify(opts)}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat("ru-RU", { ...opts, timeZone: tz });
    cache.set(key, f);
  }
  return f;
}

/** «27 июля (вт)» */
export function humanDate(iso: string | Date, tz?: string): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const day = fmt(tz, { day: "numeric", month: "long" }).format(d);
  const weekday = fmt(tz, { weekday: "short" }).format(d).replace(".", "");
  return `${day} (${weekday})`;
}

/** «17:00» */
export function humanTime(iso: string | Date, tz?: string): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return fmt(tz, { hour: "2-digit", minute: "2-digit" }).format(d);
}

/** «27 июля (вт), 17:00» — основной вид: письма, экраны, уведомления. */
export function humanDateTime(iso: string | Date, tz?: string): string {
  return `${humanDate(iso, tz)}, ${humanTime(iso, tz)}`;
}

/** «27 июля (вт), 17:00 — 17:20» — когда важна и длительность. */
export function humanRange(iso: string | Date, durationMin: number, tz?: string): string {
  const start = typeof iso === "string" ? new Date(iso) : iso;
  const end = new Date(start.getTime() + durationMin * 60_000);
  return `${humanDateTime(start, tz)} — ${humanTime(end, tz)}`;
}

/**
 * Город вместо кода пояса: «Екатеринбург», а не «Asia/Yekaterinburg».
 *
 * Лежит здесь, а не на экране: подпись пояса нужна и странице записи, и
 * витрине, и письмам. Три копии этого словаря уже жили в трёх файлах и знали
 * разные города.
 */
export function tzLabel(tz: string): string {
  const last = tz.split("/").pop() ?? tz;
  const known: Record<string, string> = {
    Moscow: "Москва",
    Kaliningrad: "Калининград",
    Samara: "Самара",
    Yekaterinburg: "Екатеринбург",
    Omsk: "Омск",
    Novosibirsk: "Новосибирск",
    Krasnoyarsk: "Красноярск",
    Irkutsk: "Иркутск",
    Yakutsk: "Якутск",
    Vladivostok: "Владивосток",
    Magadan: "Магадан",
    Kamchatka: "Камчатка",
    Buenos_Aires: "Буэнос-Айрес",
  };
  return known[last] ?? last.replace(/_/g, " ");
}

/**
 * Чьё время показано: «Москва» или «Москва · у тренера Екатеринбург».
 *
 * Пояса совпали — второй половины нет: она была бы лишним шумом. Разошлись —
 * называем оба, иначе человек не поймёт, почему тренер зовёт его на другой час.
 */
export function tzNote(viewerTz: string, trainerTz: string): string {
  return viewerTz === trainerTz
    ? tzLabel(viewerTz)
    : `${tzLabel(viewerTz)} · у тренера ${tzLabel(trainerTz)}`;
}

/** «27 июля 2026 (вт), 17:00» — там, где год не очевиден: письма о переносе. */
export function humanDateTimeFull(iso: string | Date, tz?: string): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const day = fmt(tz, { day: "numeric", month: "long", year: "numeric" }).format(d);
  const weekday = fmt(tz, { weekday: "short" }).format(d).replace(".", "");
  return `${day} (${weekday}), ${humanTime(d, tz)}`;
}
