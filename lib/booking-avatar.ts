// ВНИМАНИЕ: файл скопирован из glagol-calendar/lib/avatar.ts.
// Править только там и переносить сюда `npm run sync-design` — страница
// эталонов должна показывать ровно то, что работает в продукте.
/**
 * Инициалы и тон аватара — те же, что в витрине (lib/trainers.ts там).
 * Один тренер должен выглядеть одинаково в мини-аппе и на своей странице.
 */

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// Мягкая палитра — не спорит с красным акцентом бюро.
const AVATAR_TONES = [
  { bg: "#FDECEA", fg: "#C0392B" },
  { bg: "#EAF2FD", fg: "#2D6CDF" },
  { bg: "#EAF7EF", fg: "#1E8E5A" },
  { bg: "#F3EDFC", fg: "#7B4DD8" },
  { bg: "#FCF3E6", fg: "#C77D1A" },
  { bg: "#EAF6F6", fg: "#159393" },
] as const;

/** Стабильный тон по id — один и тот же тренер всегда одного цвета. */
export function avatarTone(id: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_TONES[h % AVATAR_TONES.length];
}

/** Русское склонение: plural(87,'отзыв','отзыва','отзывов') → 'отзывов'. */
export function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}
