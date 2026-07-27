// ВНИМАНИЕ: файл скопирован из glagol-calendar/components/trainer-avatar.tsx.
// Править только там и переносить сюда `npm run sync-design` — страница
// эталонов должна показывать ровно то, что работает в продукте.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials, avatarTone } from "@/lib/booking-avatar";

// Аватар тренера: фото или инициалы на стабильном тоне (цвет закреплён за id).
export function TrainerAvatar({
  id,
  name,
  photo,
  size = 56,
  className = "",
}: {
  id: string;
  name: string;
  photo?: string;
  size?: number;
  className?: string;
}) {
  const tone = avatarTone(id);
  return (
    <Avatar
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {photo ? <AvatarImage src={photo} alt={name} /> : null}
      <AvatarFallback
        className="font-display font-bold"
        style={{ background: tone.bg, color: tone.fg, fontSize: Math.round(size * 0.34) }}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
