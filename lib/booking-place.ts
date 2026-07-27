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

/** Подпись места для клиента: коротко и без служебных слов. */
export function placeLabel(location: string, details?: string | null): string {
  switch (location) {
    case "offline":
      return details || "очно";
    case "link":
      return details ? hostOf(details) : "своя ссылка";
    case "phone":
      return details || "по телефону";
    default:
      return "Zoom";
  }
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
