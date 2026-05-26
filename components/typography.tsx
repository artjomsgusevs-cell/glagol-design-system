import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Шрифтовая шкала бюро Глагол v1.3.2.
 *
 * Display (Onest):
 *   H1   — 36/48px · 800
 *   H2   — 24px · 800
 *   H3   — 18px · 700
 *
 * Body (Manrope):
 *   Lead    — 16/24px · 400
 *   Body    — 14/20px · 400
 *   Small   — 12/16px · 400
 *   Eyebrow — 11px · 800 UPPERCASE · tracking-[0.18em]
 */

export function Eyebrow({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  /** primary — оранжевый (по умолчанию). muted — серый. inverted — на тёмном. */
  tone?: "primary" | "muted" | "inverted";
  className?: string;
}) {
  const colorCls =
    tone === "muted"
      ? "text-muted-foreground"
      : tone === "inverted"
        ? "text-background/70"
        : "text-primary";
  return (
    <div className={cn("text-xs font-medium", colorCls, className)}>
      {children}
    </div>
  );
}

export function H1({
  children,
  className,
  hero = false,
}: {
  children: React.ReactNode;
  className?: string;
  hero?: boolean;
}) {
  return (
    <h1
      className={cn(
        "font-display font-extrabold leading-[1.05] tracking-tight",
        hero ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function H2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-2xl font-extrabold leading-tight tracking-tight",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-display text-lg font-bold leading-snug tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function Lead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-muted-foreground text-base leading-relaxed",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Small({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-muted-foreground text-xs", className)}>
      {children}
    </span>
  );
}
