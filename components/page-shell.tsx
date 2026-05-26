import * as React from "react";
import { SiteNav } from "@/components/site-nav";
import { Eyebrow, H1, Lead } from "@/components/typography";
import { cn } from "@/lib/utils";

/**
 * PageShell — единая оболочка для всех страниц UI-кита.
 * Содержит SiteNav сверху и центрированный контейнер max-w-6xl.
 * Опционально оборачивает контент в бренд-плитку с лёгким персиковым градиентом.
 */
export function PageShell({
  children,
  shell = false,
  className,
}: {
  children: React.ReactNode;
  /** Бренд-подложка под весь контент (gradient peach-accent, rounded-3xl). */
  shell?: boolean;
  className?: string;
}) {
  return (
    <div className="bg-muted/40 min-h-screen w-full px-4 py-10 sm:px-8 lg:px-12">
      <SiteNav />
      {shell ? (
        <div
          className={cn(
            "grain reveal from-card via-card to-accent/40 border-border mx-auto max-w-6xl rounded-3xl border bg-gradient-to-br p-6 sm:p-8",
            className,
          )}
        >
          {children}
        </div>
      ) : (
        <div className={cn("reveal mx-auto max-w-6xl", className)}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * PageHeader — единый шаблон заголовка страницы.
 * Eyebrow (мета-метка), H1, описание, опциональный actions-слот справа.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  size = "default",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** default — на /calendar и /dashboard. hero — крупно для главной. */
  size?: "default" | "hero";
  className?: string;
}) {
  const isHero = size === "hero";
  return (
    <header className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <H1 hero={isHero} className="mt-2">
          {title}
        </H1>
        {description &&
          (isHero ? (
            <Lead className="mt-2 max-w-2xl">{description}</Lead>
          ) : (
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              {description}
            </p>
          ))}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
