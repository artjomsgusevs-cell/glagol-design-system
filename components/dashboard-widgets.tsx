/**
 * Переиспользуемые виджеты дашборда: большие KPI, прогресс-пиллы,
 * радиальный таймер, бар-чарт недели. Используются в /dashboard и в demo.
 */

import * as React from "react";
import { Eyebrow } from "@/components/typography";

/* =========== Прогресс-пилла ============ */

export function ProgressPill({
  label,
  value,
  tone,
  size = "default",
}: {
  label: string;
  value: number;
  tone: "ink" | "primary" | "success" | "warning" | "muted";
  size?: "default" | "sm";
}) {
  const trackCls: Record<typeof tone, string> = {
    ink: "bg-foreground text-background",
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    muted: "bg-muted text-foreground",
  };
  const h = size === "sm" ? "h-7 w-24" : "h-9 w-32";
  return (
    <div className="flex flex-col gap-1.5">
      <Eyebrow tone="muted" className="text-[10.5px] tracking-[0.14em]">
        {label}
      </Eyebrow>
      <div
        className={`flex items-center justify-center rounded-full font-semibold tabular-nums ${h} ${trackCls[tone]}`}
      >
        <span
          className={
            size === "sm" ? "text-xs font-extrabold" : "text-sm font-extrabold"
          }
        >
          {value}%
        </span>
      </div>
    </div>
  );
}

/* =========== Большой KPI с иконкой ============ */

export function BigKpi({
  value,
  label,
  icon: Icon,
  size = "default",
}: {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  size?: "default" | "sm";
}) {
  return (
    <div className="flex flex-col items-end">
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
        <Icon className="size-4" />
        {label}
      </div>
      <div
        className={`font-display font-extrabold leading-none tracking-tight tabular-nums ${
          size === "sm" ? "text-3xl" : "text-4xl sm:text-5xl"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/* =========== Радиальный таймер ============ */

export function RadialTimer({
  value,
  label,
  sublabel,
  size = "default",
}: {
  value: number;
  label: string;
  sublabel: string;
  size?: "default" | "sm";
}) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  const dim = size === "sm" ? "size-24" : "size-28";
  return (
    <div className={`relative ${dim}`}>
      <svg
        viewBox="0 0 100 100"
        className="-rotate-90"
        width="100%"
        height="100%"
      >
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className={`font-display font-extrabold tabular-nums ${
            size === "sm" ? "text-lg" : "text-xl"
          }`}
        >
          {label}
        </div>
        <div className="text-muted-foreground text-[10px] font-semibold">
          {sublabel}
        </div>
      </div>
    </div>
  );
}

/* =========== План факт продаж ============ */

/**
 * Трёхсегментный прогресс-бар + крупный факт/план в рублях.
 * Оранжевый — подтверждённый факт, чёрный — предварительно, серый — добрать.
 */
export function SalesPlanProgress({
  title = "План",
  month,
  fact,
  pre,
  plan,
  size = "default",
}: {
  /** Верхний eyebrow-заголовок */
  title?: string;
  /** Подпись месяца справа от заголовка, опционально */
  month?: string;
  /** Подтверждённая выручка (оранжевый сегмент), в рублях */
  fact: number;
  /** Предварительные брони (чёрный сегмент), в рублях */
  pre: number;
  /** Полный план месяца, в рублях */
  plan: number;
  size?: "default" | "sm";
}) {
  const factPct = Math.min(100, (fact / plan) * 100);
  const prePct = Math.min(100 - factPct, (pre / plan) * 100);
  const restPct = Math.max(0, 100 - factPct - prePct);
  // «От плана» = только подтверждённый факт (то, что реально оплачено/закрыто).
  const totalPct = Math.round(factPct);

  const fmt = (n: number) => {
    if (n >= 1_000_000)
      return (
        "₽ " +
        (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) +
        "M"
      );
    if (n >= 1000) return "₽ " + Math.round(n / 1000) + "K";
    return "₽ " + n;
  };

  const isLg = size === "default";
  return (
    <div
      className={`border-border bg-card flex flex-col gap-4 rounded-xl border ${
        isLg ? "p-6" : "p-4"
      }`}
    >
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <Eyebrow tone="muted" className="text-[10.5px] tracking-[0.14em]">
            {title}
            {month && (
              <span className="text-muted-foreground/70 ml-1.5 font-semibold normal-case tracking-normal">
                · {month}
              </span>
            )}
          </Eyebrow>
          <div className="mt-1 flex items-baseline gap-x-2 tabular-nums">
            <span
              className={`font-display font-extrabold leading-none tracking-tight ${
                isLg ? "text-3xl sm:text-4xl" : "text-2xl"
              }`}
            >
              {fmt(fact)}
            </span>
            <span
              className={`text-muted-foreground/70 font-semibold whitespace-nowrap ${
                isLg ? "text-sm" : "text-[11px]"
              }`}
            >
              из {fmt(plan)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <Eyebrow tone="muted" className="text-[10.5px] tracking-[0.14em]">
            От плана
          </Eyebrow>
          <div
            className={`font-display tabular-nums mt-1 ${
              isLg ? "text-3xl sm:text-4xl" : "text-2xl"
            } font-extrabold leading-none tracking-tight`}
          >
            {totalPct}%
          </div>
        </div>
      </div>

      <div className="bg-muted flex h-3 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full"
          style={{ width: `${factPct}%` }}
        />
        <div
          className="bg-foreground h-full rounded-full"
          style={{ width: `${prePct}%`, marginLeft: prePct > 0 ? 2 : 0 }}
        />
        {restPct > 0 && (
          <div
            className="flex-1"
            style={{ minWidth: 0 }}
            aria-hidden="true"
          />
        )}
      </div>

      <div
        className={`text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 ${
          isLg ? "text-xs" : "text-[11px]"
        }`}
      >
        <LegendDot tone="primary" label="Подтверждено" value={fmt(fact)} />
        <LegendDot tone="ink" label="Предварительно" value={fmt(pre)} />
        <LegendDot
          tone="muted"
          label="Добрать"
          value={fmt(Math.max(0, plan - fact - pre))}
        />
      </div>
    </div>
  );
}

function LegendDot({
  tone,
  label,
  value,
}: {
  tone: "primary" | "ink" | "muted";
  label: string;
  value: string;
}) {
  const dot =
    tone === "primary"
      ? "bg-primary"
      : tone === "ink"
        ? "bg-foreground"
        : "bg-muted-foreground/30";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${dot}`} />
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-semibold tabular-nums">
        {value}
      </span>
    </span>
  );
}

/* =========== Бар-чарт недели ============ */

export type WeekBar = { day: string; hours: number; peak?: boolean };

export function WeekBars({
  bars,
  max = 9,
  height = "h-24",
}: {
  bars: WeekBar[];
  max?: number;
  height?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-1.5 ${height}`}>
      {bars.map((b) => {
        const h = Math.max((b.hours / max) * 100, 8);
        return (
          <div
            key={b.day}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className="relative flex h-full w-full items-end">
              {b.peak && (
                <span className="bg-primary text-primary-foreground absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold tabular-nums">
                  {b.hours}ч
                </span>
              )}
              <div
                className={`w-full rounded-md ${
                  b.peak
                    ? "bg-primary"
                    : b.hours > 0
                      ? "bg-foreground"
                      : "bg-muted"
                }`}
                style={{ height: `${h}%` }}
              />
            </div>
            <div className="text-muted-foreground text-[10px] font-semibold">
              {b.day}
            </div>
          </div>
        );
      })}
    </div>
  );
}
