"use client";

import * as React from "react";
import { PageShell, PageHeader } from "@/components/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@/components/ui/avatar";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PlusIcon,
  ClockIcon,
  VideoIcon,
  MapPinIcon,
} from "lucide-react";

/* =========================================================
   Календарь · мини-интерфейс v1.4
   Двух-недельный обзор + временная шкала событий дня.
   Референс: Crextio dashboard (welcome+timeline вариант).
   ========================================================= */

type EventTone = "primary" | "accent" | "muted";

type DayEvent = {
  start: string;
  end: string;
  title: string;
  subtitle: string;
  participants: string[];
  tone: EventTone;
  location?: string;
};

const WEEK_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DAYS = [
  { day: 22, weekday: "Пн", events: 1 },
  { day: 23, weekday: "Вт", events: 0 },
  { day: 24, weekday: "Ср", active: true, events: 3 },
  { day: 25, weekday: "Чт", events: 2 },
  { day: 26, weekday: "Пт", events: 1 },
  { day: 27, weekday: "Сб", events: 0 },
  { day: 28, weekday: "Вс", events: 0 },
];

const TIMELINE: { time: string; event?: DayEvent }[] = [
  { time: "08:00" },
  {
    time: "09:00",
    event: {
      start: "09:00",
      end: "10:30",
      title: "Sync команды продаж",
      subtitle: "Обсуждение прогресса по проектам",
      participants: ["Ю.Г", "А.С", "С.А"],
      tone: "accent",
      location: "Zoom",
    },
  },
  { time: "10:00" },
  {
    time: "11:00",
    event: {
      start: "11:00",
      end: "12:30",
      title: "Воркшоп · Продажи 2.0",
      subtitle: "Юля Глазкова · группа из 8 человек",
      participants: ["Ю.Г", "А.Г"],
      tone: "primary",
      location: "Москва · офис",
    },
  },
  { time: "12:00" },
  { time: "13:00" },
  {
    time: "14:00",
    event: {
      start: "14:30",
      end: "16:00",
      title: "Onboarding · новые тренеры",
      subtitle: "Знакомство с порталом",
      participants: ["А.Г", "Е.Л"],
      tone: "muted",
    },
  },
];

const MONTHS = [
  { label: "Август", active: false },
  { label: "Сентябрь 2026", active: true },
  { label: "Октябрь", active: false },
];

export default function CalendarPage() {
  return (
    <PageShell>
      <PageHeader
        size="hero"
        eyebrow="Календарь · мини-интерфейс"
        title="Неделя · 22 — 28 сентября"
        description="Компактная сетка дней с временной шкалой и карточками событий. Пример экрана дизайн-системы."
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarIcon />
              Сегодня
            </Button>
            <Button size="sm">
              <PlusIcon />
              Новая бронь
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-12">
          {/* ===== недельный обзор ===== */}
          <Card className="lg:col-span-12">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="bg-muted flex items-center gap-1 rounded-full p-1">
                  {MONTHS.map((m) => (
                    <button
                      key={m.label}
                      className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors ${
                        m.active
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronLeftIcon />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronRightIcon />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d.day}
                    className={`group flex flex-col items-center gap-2 rounded-2xl border px-3 py-3 transition-colors ${
                      d.active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-accent/40"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        d.active
                          ? "text-primary-foreground/85"
                          : "text-muted-foreground"
                      }`}
                    >
                      {d.weekday}
                    </span>
                    <span className="font-display text-2xl font-extrabold leading-none tabular-nums">
                      {d.day}
                    </span>
                    {d.events > 0 ? (
                      <span
                        className={`text-[10px] font-semibold ${
                          d.active
                            ? "text-primary-foreground/90"
                            : "text-muted-foreground"
                        }`}
                      >
                        {d.events} событ{d.events === 1 ? "ие" : "ия"}
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-semibold ${
                          d.active
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        —
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ===== временная шкала дня ===== */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-display text-lg">
                    Среда · 24 сентября
                  </CardTitle>
                  <CardDescription>
                    3 события · 2 онлайн, 1 в офисе
                  </CardDescription>
                </div>
                <Badge variant="outline" className="gap-1">
                  <span className="bg-success size-1.5 rounded-full" />
                  Свободно после 16:00
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-0">
                {TIMELINE.map((row, i) => (
                  <TimelineRow key={i} time={row.time} event={row.event} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ===== сайдбар: ближайшие + чипы ===== */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Месячная сводка
                </CardTitle>
                <CardDescription>Сентябрь 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <MiniMonth />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Скоро
                </CardTitle>
                <CardDescription>Следующие 3 события</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <UpcomingItem
                  date="Чт · 25 сент"
                  time="10:00 – 12:00"
                  title="Лидерство 2.0"
                  who="Андрей Суворков"
                  tone="primary"
                />
                <UpcomingItem
                  date="Чт · 25 сент"
                  time="15:00 – 16:30"
                  title="Командная диагностика"
                  who="Сабина Алиева"
                  tone="accent"
                />
                <UpcomingItem
                  date="Пт · 26 сент"
                  time="09:30 – 11:00"
                  title="Стратегия Q4"
                  who="Юля Глазкова"
                  tone="muted"
                />
              </CardContent>
            </Card>
          </div>
        </div>
    </PageShell>
  );
}

/* ============== вспомогательные ============== */

function TimelineRow({
  time,
  event,
}: {
  time: string;
  event?: DayEvent;
}) {
  return (
    <div className="border-border/70 flex items-start gap-4 border-b py-2.5 last:border-b-0">
      <div className="text-muted-foreground w-12 shrink-0 pt-1 text-right text-xs tabular-nums">
        {time}
      </div>
      <div className="min-h-9 flex-1">
        {event ? <EventCard event={event} /> : null}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: DayEvent }) {
  const tones: Record<EventTone, string> = {
    primary:
      "bg-primary text-primary-foreground border-primary",
    accent:
      "bg-accent text-accent-foreground border-accent",
    muted: "bg-card text-foreground border-border",
  };
  const subtitleTone: Record<EventTone, string> = {
    primary: "text-primary-foreground/85",
    accent: "text-accent-foreground/80",
    muted: "text-muted-foreground",
  };
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${tones[event.tone]}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs font-semibold opacity-80">
          <ClockIcon className="size-4" />
          <span className="tabular-nums">
            {event.start} – {event.end}
          </span>
          {event.location && (
            <>
              <span aria-hidden="true">·</span>
              {event.location.startsWith("Zoom") ? (
                <VideoIcon className="size-4" />
              ) : (
                <MapPinIcon className="size-4" />
              )}
              <span>{event.location}</span>
            </>
          )}
        </div>
        <div className="font-display mt-1 truncate text-sm font-extrabold leading-tight">
          {event.title}
        </div>
        <div className={`mt-0.5 truncate text-xs ${subtitleTone[event.tone]}`}>
          {event.subtitle}
        </div>
      </div>
      <AvatarGroup className="shrink-0">
        {event.participants.map((p) => (
          <Avatar key={p} size="sm">
            <AvatarFallback className="text-[10px] font-semibold">
              {p}
            </AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  );
}

function UpcomingItem({
  date,
  time,
  title,
  who,
  tone,
}: {
  date: string;
  time: string;
  title: string;
  who: string;
  tone: EventTone;
}) {
  const dot: Record<EventTone, string> = {
    primary: "bg-primary",
    accent: "bg-accent border border-accent-foreground/20",
    muted: "bg-muted-foreground/30",
  };
  return (
    <div className="border-border bg-card hover:bg-accent/30 flex items-start gap-3 rounded-xl border p-3 transition-colors">
      <div className={`mt-1 size-3 shrink-0 rounded-full ${dot[tone]}`} />
      <div className="min-w-0 flex-1">
        <div className="text-muted-foreground text-xs font-medium">
          {date} · {time}
        </div>
        <div className="font-display mt-0.5 truncate text-sm font-extrabold">
          {title}
        </div>
        <div className="text-muted-foreground truncate text-xs">{who}</div>
      </div>
    </div>
  );
}

function MiniMonth() {
  // 30-дневная сетка под сентябрь 2026 (1 сент = Вт)
  const start = 1; // index of «1» in week-grid (0=Пн)
  const offset = 1; // 1 сентября = вторник (индекс 1)
  const totalDays = 30;
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = start; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const HIGHLIGHTED = [24];
  const HAS_EVENTS = [3, 9, 11, 16, 22, 24, 25, 26, 29];

  return (
    <div className="grid gap-2">
      <div className="text-muted-foreground grid grid-cols-7 gap-1 text-[11px] font-medium">
        {WEEK_LABELS.map((w) => (
          <div key={w} className="text-center">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const active = HIGHLIGHTED.includes(d);
          const hasDot = HAS_EVENTS.includes(d) && !active;
          return (
            <button
              key={i}
              className={`relative flex aspect-square items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent/50"
              }`}
            >
              {d}
              {hasDot && (
                <span className="bg-primary absolute bottom-1 size-1 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
