// ВНИМАНИЕ: файл скопирован из glagol-calendar/lib/place.ts.
// Править только там и переносить сюда `npm run sync-design` — страница
// эталонов должна показывать ровно то, что работает в продукте.
/**
 * Где проходит встреча.
 *
 * Четыре варианта. `online` — комната тренера (Zoom, свой аккаунт или
 * постоянная ссылка). `link` — чужая переговорка: заказчик работает в Телемосте
 * или Мите, и тренеру нужно подставить именно её адрес. `offline` — адрес в
 * городе. `phone` остался только у старых записей: выбрать его больше нельзя,
 * но показывать надо, иначе прошедшие встречи потеряют место.
 */

export type Place = "online" | "link" | "offline" | "phone";

export const PLACE_OPTIONS: Array<{ value: Place; label: string }> = [
  { value: "online", label: "Zoom — ваша комната" },
  { value: "link", label: "Своя ссылка — Телемост, Мит, что угодно" },
  { value: "offline", label: "Очно — по адресу" },
];

/**
 * Подпись места для клиента: коротко и без служебных слов.
 *
 * `room` — постоянная комната тренера из профиля. Поле подписано как зумовское,
 * но кладут туда что удобно: у Галы там Яндекс.Телемост. Слово «Zoom» в этом
 * случае врёт — человек читает одно, а попадает в другое, — поэтому называем
 * место по адресу, куда он на самом деле придёт (docs/RULES.md, «Тексты»).
 *
 * Саму ссылку наружу не отдаём: подпись считается на сервере, клиент получает
 * только домен.
 */
export function placeLabel(location: string, details?: string | null, room?: string | null): string {
  switch (location) {
    case "offline":
      return details || "очно";
    case "link":
      return details ? hostOf(details) : "своя ссылка";
    case "phone":
      return details || "по телефону";
    default:
      return room && !isZoom(room) ? hostOf(room) : "Zoom";
  }
}

/** Адрес ведёт в Zoom? Поддомены компаний тоже считаются: us02web.zoom.us. */
function isZoom(url: string): boolean {
  const host = hostOf(url).toLowerCase();
  return host === "zoom.us" || host.endsWith(".zoom.us");
}

/** «telemost.yandex.ru» вместо простыни с идентификатором комнаты. */
export function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export const isUrl = (v: string): boolean => /^https?:\/\/\S+$/i.test(v.trim());
