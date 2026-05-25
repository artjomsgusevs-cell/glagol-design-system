"use client";

import * as React from "react";
import { PageShell, PageHeader } from "@/components/page-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRightIcon,
  PauseIcon,
  PlayIcon,
  CheckIcon,
  ClockIcon,
  UsersIcon,
  BriefcaseIcon,
  LayoutGridIcon,
  ChevronRightIcon,
  PhoneIcon,
  FileTextIcon,
  CalendarCheckIcon,
} from "lucide-react";
import {
  BigKpi,
  ProgressPill,
  RadialTimer,
  SalesPlanProgress,
} from "@/components/dashboard-widgets";

/* =========================================================
   Дашборд · KPI v1.3
   Референс: Crextio HR dashboard + Limits-cards.
   Адаптирован под домен бюро Глагол (брони, тренеры, проекты).
   ========================================================= */

const PROGRESS_BARS = [
  { label: "Брони", value: 15, tone: "ink" as const },
  { label: "Подтверждено", value: 65, tone: "primary" as const },
  { label: "Выполнено", value: 80, tone: "success" as const },
  { label: "Свободно", value: 10, tone: "muted" as const },
];

const BIG_KPI = [
  { value: 78, label: "Брони", icon: BriefcaseIcon },
  { value: 12, label: "Тренеры", icon: UsersIcon },
  { value: 203, label: "Проекты", icon: LayoutGridIcon },
];

const MANAGER_TASKS: {
  title: string;
  due: string;
  done: boolean;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    title: "Перезвонить Ipsos по программе",
    due: "Сегодня · 11:00",
    done: true,
    icon: PhoneIcon,
  },
  {
    title: "Согласовать даты с Авито",
    due: "Сегодня · 14:00",
    done: true,
    icon: CalendarCheckIcon,
  },
  {
    title: "Выставить счёт MWS Summer Lab",
    due: "Завтра · 10:00",
    done: false,
    icon: FileTextIcon,
  },
  {
    title: "Брифинг тренеров на воркшоп",
    due: "Завтра · 15:00",
    done: false,
    icon: UsersIcon,
  },
  {
    title: "Подтвердить программу Билайн",
    due: "Чт · 12:00",
    done: false,
    icon: CheckIcon,
  },
];

export default function DashboardPage() {
  return (
    <PageShell shell>
      <PageHeader
        size="hero"
        eyebrow="бюро Глагол · 25 мая 2026"
        title={
          <>
            Добро пожаловать,{" "}
            <span className="text-primary">Артём</span>
          </>
        }
      />

      {/* ===== welcome metrics: pills + big nums ===== */}
      <div className="-mt-2 mb-7 grid items-start gap-6 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-3">
          {PROGRESS_BARS.map((p) => (
            <ProgressPill key={p.label} {...p} />
          ))}
        </div>
        <div className="flex items-end gap-5 sm:gap-7">
          {BIG_KPI.map((k) => (
            <BigKpi key={k.label} {...k} />
          ))}
        </div>
      </div>

        {/* ===== row 1: профиль + tracker + onboarding ===== */}
        <div className="mt-7 grid gap-4 lg:grid-cols-12">
          {/* профиль тренера */}
          <Card className="bg-card/80 backdrop-blur overflow-hidden p-0 lg:col-span-3">
            <div className="bg-muted relative h-56 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/trainer-01-full.jpg"
                alt="Артём Гусев"
                className="absolute inset-0 size-full object-cover object-top"
                draggable={false}
              />
            </div>
            <CardContent className="space-y-3 px-4 pt-3 pb-4">
              <div>
                <div className="font-display text-base font-extrabold leading-tight">
                  Артём Гусев
                </div>
                <div className="text-muted-foreground text-xs">
                  Тренер · программы продаж
                </div>
              </div>
              <div className="border-border flex items-center justify-between rounded-full border px-3 py-1.5">
                <span className="text-muted-foreground text-xs font-medium">
                  В работе
                </span>
                <span className="font-display text-sm font-extrabold tabular-nums">
                  12 проектов
                </span>
              </div>
            </CardContent>
          </Card>

          {/* time tracker */}
          <Card className="bg-card/80 backdrop-blur lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription className="text-[10.5px] font-extrabold uppercase tracking-[0.14em]">
                  Тайм-трекер
                </CardDescription>
                <Button variant="ghost" size="icon" className="size-8 rounded-full">
                  <ArrowUpRightIcon />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-3">
                <RadialTimer value={62} label="02:35" sublabel="Раб. время" />
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" className="size-8 rounded-full">
                    <PlayIcon />
                  </Button>
                  <Button size="icon" variant="outline" className="size-8 rounded-full">
                    <PauseIcon />
                  </Button>
                  <Button size="icon" className="size-8 rounded-full">
                    <ClockIcon />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* задачи менеджера */}
          <div className="flex flex-col gap-3 lg:col-span-6">
            <Card className="bg-foreground text-background flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription className="text-background/60 text-xs font-medium">
                    Задачи менеджера
                  </CardDescription>
                  <span className="font-display text-2xl font-extrabold tabular-nums">
                    2/5
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {MANAGER_TASKS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.title} className="flex items-center gap-2">
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                          t.done
                            ? "bg-primary text-primary-foreground"
                            : "border-background/30 border"
                        }`}
                      >
                        {t.done ? (
                          <CheckIcon className="size-3" />
                        ) : (
                          <Icon className="size-3 text-background/70" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`truncate text-xs font-semibold ${
                            t.done ? "text-background/50 line-through" : ""
                          }`}
                        >
                          {t.title}
                        </div>
                        <div className="text-background/55 truncate text-[10px]">
                          {t.due}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ===== row 2: план продаж на 2 месяца + summary ===== */}
        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <SalesPlanProgress
              title="План"
              month="Май 2026"
              fact={3_420_000}
              pre={1_580_000}
              plan={7_800_000}
              size="sm"
            />
            <SalesPlanProgress
              title="План"
              month="Июнь 2026"
              fact={1_125_000}
              pre={920_000}
              plan={4_800_000}
              size="sm"
            />
          </div>

          <Card className="bg-card/90 backdrop-blur lg:col-span-5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-base">
                  Сводка месяца
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  Все события
                  <ChevronRightIcon />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <SummaryRow label="Подтверждено броней" value="28" delta="+12%" />
              <SummaryRow
                label="Выручка к плану"
                value="₽ 3.4M"
                delta="+8%"
                deltaTone="success"
              />
              <SummaryRow
                label="Свободные слоты"
                value="14"
                delta="-3%"
                deltaTone="warning"
              />
            </CardContent>
          </Card>
        </div>
    </PageShell>
  );
}

/* ============== вспомогательные ============== */

function SummaryRow({
  label,
  value,
  delta,
  deltaTone = "muted",
}: {
  label: string;
  value: string;
  delta: string;
  deltaTone?: "success" | "warning" | "muted";
}) {
  const tones: Record<string, string> = {
    success: "text-success",
    warning: "text-warning",
    muted: "text-muted-foreground",
  };
  return (
    <div className="border-border bg-card/60 flex items-center justify-between rounded-xl border p-3">
      <div className="text-foreground text-xs font-semibold">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="font-display text-lg font-extrabold tabular-nums">
          {value}
        </div>
        <div className={`text-[11px] font-semibold ${tones[deltaTone]}`}>
          {delta}
        </div>
      </div>
    </div>
  );
}
