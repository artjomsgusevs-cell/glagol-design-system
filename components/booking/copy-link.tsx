// ВНИМАНИЕ: файл скопирован из glagol-calendar/components/copy-link.tsx.
// Править только там и переносить сюда `npm run sync-design` — страница
// эталонов должна показывать ровно то, что работает в продукте.
"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/** Firefox без разрешения и http-контексты: запасной путь — выделение. */
async function writeClipboard(url: string) {
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const input = document.createElement("input");
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
}

/**
 * Кнопка «Скопировать» без строки адреса.
 *
 * В списке календарей сам адрес читать не нужно: тренер копирует его и
 * отправляет клиенту. Постоянная строка с адресом делала карточку вдвое выше,
 * поэтому здесь остаётся один жест. Без подписи кнопка становится иконкой.
 *
 * Ширина фиксирована, чтобы при смене подписи на «Скопировано» ряд не дёргался.
 */
export function CopyButton({
  url,
  label,
  className,
}: {
  url: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await writeClipboard(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      aria-label={copied ? "Ссылка скопирована" : "Скопировать ссылку"}
      title={url.replace(/^https?:\/\//, "")}
      className={cn(
        "flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition active:scale-95",
        label ? "w-[136px]" : "size-10",
        className,
      )}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {label && (copied ? "Скопировано" : label)}
    </button>
  );
}

/**
 * Ссылка с кнопкой «Скопировать» — главный жест этого продукта: тренер копирует
 * и отправляет клиенту.
 *
 * Ширина кнопки фиксирована, чтобы при смене подписи на «Скопировано» строка не
 * дёргалась.
 */
export function CopyLink({ url, compact = false }: { url: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  // На узком экране рядом с кнопкой остаётся полоска в пару сантиметров:
  // домен туда не влезает и обрезается в бесполезное «calendar.glagol…».
  // Показываем последний кусок адреса — именно он различает ссылки.
  const shown = url.replace(/^https?:\/\//, "");
  const lastSegment = "/" + (shown.split("/").filter(Boolean).pop() ?? "");

  async function copy() {
    await writeClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <code
        className={cn(
          "min-w-0 flex-1 truncate rounded-xl bg-muted px-3 py-2 font-mono text-sm text-muted-foreground",
          compact && "py-1.5 text-xs",
        )}
        title={shown}
      >
        <span className="sm:hidden">{lastSegment}</span>
        <span className="hidden sm:inline">{shown}</span>
      </code>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "flex h-10 w-[132px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition active:scale-95",
          compact && "h-9 w-[120px] text-[13px]",
        )}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Скопировано" : "Скопировать"}
      </button>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label="Открыть страницу"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition hover:text-foreground active:scale-95"
      >
        <ExternalLink className="size-4" />
      </a>
    </div>
  );
}
