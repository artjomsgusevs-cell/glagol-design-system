// ВНИМАНИЕ: файл скопирован из glagol-calendar/components/step.tsx.
// Править только там и переносить сюда `npm run sync-design` — страница
// эталонов должна показывать ровно то, что работает в продукте.
/**
 * Строка «иконка — заголовок — пояснение».
 *
 * Одна и та же на экране после записи и на странице управления: человек
 * попадает на вторую по ссылке из письма, иногда через неделю, и должен
 * увидеть ровно те же слова, что видел сразу после оплаты. Разные формулировки
 * об одном и том же читаются как разные состояния.
 */
export function Step({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-sm text-muted-foreground">{children}</span>
      </span>
    </li>
  );
}
