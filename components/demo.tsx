"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

/* =========================================================
   Глагол · Дизайн-система v1.2 · демо-страница
   Структурно повторяет shadcn Demo (radix-nova / next-monorepo):
   двухколоночная сетка карточек с обзором стилей, иконками,
   кнопками, формой, таблицей и hero-блоком.
   ========================================================= */

const BRAND_TOKENS: {
  name: string;
  varName: string;
  hex: string;
  note: string;
}[] = [
  { name: "Ink", varName: "--foreground", hex: "#1A1A1A", note: "Текст" },
  { name: "Paper", varName: "--background", hex: "#F6F6F6", note: "Фон" },
  { name: "Surface", varName: "--card", hex: "#FCFCFC", note: "Поверхности" },
  { name: "Orange", varName: "--primary", hex: "#FF5C00", note: "Акценты/CTA" },
  { name: "Peach", varName: "--accent", hex: "#F8CFB8", note: "Декор" },
  { name: "Success", varName: "--success", hex: "#3FBF6A", note: "Confirmed" },
  { name: "Warning", varName: "--warning", hex: "#C76A00", note: "Warn" },
  {
    name: "Destructive",
    varName: "--destructive",
    hex: "#B42318",
    note: "Конфликт",
  },
];

const ICONS = [
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PlusIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  SparklesIcon,
];

export function Demo() {
  const [sliderValue, setSliderValue] = React.useState<number[]>([72]);
  const [tab, setTab] = React.useState("calendar");

  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-muted/40 min-h-screen w-full px-4 py-10 sm:px-8 lg:px-12">
        {/* ========== Шапка ========== */}
        <header className="mx-auto mb-10 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-foreground text-background font-display flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold">
                Г
              </div>
              <div>
                <div className="font-display text-base font-extrabold leading-tight">
                  Глагол DS
                </div>
                <div className="text-muted-foreground text-xs">
                  v1.2 · 2026-05-22
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Next 16 · Tailwind 4 · shadcn
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://github.com/artjomsgusevs-cell/glagol-design-system"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                  <ExternalLinkIcon />
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-primary mb-3 text-xs font-extrabold uppercase tracking-[0.18em]">
              Бюро Глагол · Внутренний портал
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Дизайн-система <span className="text-primary">v1.2</span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
              Брендовые цвета, типографика, радиусы и компоненты, на которых
              собран портал бронирования бюро Глагол. Источник правды —{" "}
              <code className="bg-muted rounded px-1.5 py-0.5 text-[0.85em]">
                src/app/globals.css
              </code>
              .
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge className="bg-primary/15 text-primary border-primary/30 border">
                Оранж = акценты/CTA
              </Badge>
              <Badge className="bg-accent text-accent-foreground border-accent/40 border">
                Персик = декор-подложка
              </Badge>
              <Badge variant="secondary">Никогда чистый #000 / #fff</Badge>
            </div>
          </div>
        </header>

        {/* ========== Грид ========== */}
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-12">
          {/* --- COL 1: токены, иконки, kpi --- */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Style Overview</CardTitle>
                <CardDescription>
                  Восемь брендовых токенов, на которых держится интерфейс. Имена
                  соответствуют CSS-переменным.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                  {BRAND_TOKENS.map((t) => (
                    <div key={t.name} className="flex flex-col gap-2">
                      <div
                        className="border-border ring-border/40 relative aspect-square w-full rounded-lg border ring-1"
                        style={{ background: `var(${t.varName})` }}
                        title={`${t.name} · ${t.hex} · ${t.note}`}
                      />
                      <div>
                        <div className="text-[11px] font-semibold leading-tight">
                          {t.name}
                        </div>
                        <div className="text-muted-foreground font-mono text-[10px]">
                          {t.hex}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="grid gap-3">
                  <TypeRow
                    sample={
                      <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
                        Внутренний портал · v1.2
                      </h1>
                    }
                    meta="Display H1 · 30/800"
                  />
                  <TypeRow
                    sample={
                      <h2 className="font-display text-xl font-extrabold tracking-tight">
                        Календарь и услуги
                      </h2>
                    }
                    meta="Display H2 · 20/800"
                  />
                  <TypeRow
                    sample={
                      <p className="text-foreground text-sm leading-relaxed">
                        Основной текст — Wix Madefor Text, 14px.
                      </p>
                    }
                    meta="Body · 14/400"
                  />
                  <TypeRow
                    sample={
                      <p className="text-muted-foreground text-[11px] font-extrabold uppercase tracking-[0.14em]">
                        название поля формы
                      </p>
                    }
                    meta="Label · 11/800 UPPER"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Иконки Lucide
                </CardTitle>
                <CardDescription>
                  Базовая иконография, strokeWidth 1.75
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-3 sm:grid-cols-11">
                  {ICONS.map((Icon, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger asChild>
                        <Card className="hover:bg-accent/40 flex aspect-square cursor-pointer items-center justify-center p-0 shadow-none transition-colors *:[svg]:size-4">
                          <Icon />
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        {Icon.displayName ?? "icon"}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display text-base">
                    KPI · май 2026
                  </CardTitle>
                  <CardDescription>
                    Карточки и индикаторы прогресса
                  </CardDescription>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex">
                  Live
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <KpiTile label="Броней" value={42} delta="+12%" />
                  <KpiTile
                    label="Подтверждено"
                    value={28}
                    delta="+8%"
                    tone="success"
                  />
                  <KpiTile
                    label="Предварительно"
                    value={14}
                    delta="-3%"
                    tone="warning"
                  />
                </div>
                <div className="mt-5 grid gap-4">
                  <ProgressRow
                    label="Загрузка тренеров"
                    value={72}
                    tone="primary"
                  />
                  <ProgressRow
                    label="Подтверждено vs план"
                    value={88}
                    tone="success"
                  />
                  <ProgressRow
                    label="Свободные слоты"
                    value={32}
                    tone="warning"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- COL 2: кнопки, форма, поиск --- */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Кнопки и бейджи
                </CardTitle>
                <CardDescription>Базовые варианты shadcn</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <PlusIcon /> Бронь
                  </Button>
                  <Button variant="secondary">Отмена</Button>
                  <Button variant="outline">Редактировать</Button>
                  <Button variant="ghost">Подробнее</Button>
                  <Button variant="destructive">Удалить</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Подтверждено</Badge>
                  <Badge variant="secondary">Предварительно</Badge>
                  <Badge variant="destructive">Конфликт</Badge>
                  <Badge variant="outline">Часть серии</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Новая бронь
                </CardTitle>
                <CardDescription>
                  Input, Select, Textarea, Switch, Slider
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project">Название проекта</Label>
                  <Input
                    id="project"
                    placeholder="Воркшоп по продажам"
                    defaultValue="Воркшоп по продажам"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Тренер</Label>
                    <Select defaultValue="anna">
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anna">Анна Иванова</SelectItem>
                        <SelectItem value="petr">Пётр Сидоров</SelectItem>
                        <SelectItem value="maria">Мария Кравцова</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Формат</Label>
                    <Select defaultValue="offline">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offline">Офлайн</SelectItem>
                        <SelectItem value="online">Онлайн</SelectItem>
                        <SelectItem value="hybrid">Гибрид</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Заметка</Label>
                  <Textarea
                    placeholder="Контекст брони, ссылки, вложения…"
                    rows={2}
                    className="resize-none"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="series" defaultChecked />
                    <Label htmlFor="series" className="cursor-pointer">
                      Серия воркшопов
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="invite" defaultChecked />
                    <Label htmlFor="invite" className="cursor-pointer">
                      Слать инвайт
                    </Label>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Длительность</Label>
                    <span className="text-muted-foreground font-mono text-xs">
                      {sliderValue[0]} мин
                    </span>
                  </div>
                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    min={30}
                    max={240}
                    step={15}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost">Отмена</Button>
                  <Button>
                    <CheckIcon />
                    Сохранить
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Поиск и навигация
                </CardTitle>
                <CardDescription>Tabs + Input с иконкой</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="relative">
                  <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Найти бронь, проект, тренера…"
                    className="pl-9"
                  />
                </div>
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="calendar" className="flex-1">
                      Календарь
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex-1">
                      Список
                    </TabsTrigger>
                    <TabsTrigger value="kanban" className="flex-1">
                      Канбан
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="calendar">
                    <p className="text-muted-foreground pt-3 text-xs">
                      Месячная сетка, выходные с оранжевым тинтом.
                    </p>
                  </TabsContent>
                  <TabsContent value="list">
                    <p className="text-muted-foreground pt-3 text-xs">
                      Таблица с группировкой по проектам.
                    </p>
                  </TabsContent>
                  <TabsContent value="kanban">
                    <p className="text-muted-foreground pt-3 text-xs">
                      Три колонки: Pre · Confirmed · Готово.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* --- ROW 2: таблица + чипы --- */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Список броней · май
                </CardTitle>
                <CardDescription>
                  Сводная таблица с пилюлями статуса и аватарами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Проект</TableHead>
                      <TableHead>Тренер</TableHead>
                      <TableHead>Формат</TableHead>
                      <TableHead className="text-right">Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {BOOKINGS.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs">
                          {b.date}
                        </TableCell>
                        <TableCell className="font-medium">{b.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarFallback className="text-[10px]">
                                {b.trainer
                                  .split(" ")
                                  .map((p) => p[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{b.trainer}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {b.format}
                        </TableCell>
                        <TableCell className="text-right">
                          <StatusPill status={b.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Чипы календаря
                </CardTitle>
                <CardDescription>
                  Цветной левый бордер маркирует статус
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <CalChip
                  status="confirmed"
                  time="18:00"
                  title="Воркшоп продажи"
                  who="Анна Иванова"
                />
                <CalChip
                  status="pre"
                  time="10:00"
                  title="Лидерство 2.0"
                  who="Пётр Сидоров"
                />
                <CalChip
                  status="conflict"
                  time="19:00"
                  title="Двойная бронь"
                  who="Конфликт расписания"
                />
                <Separator className="my-1" />
                <div className="text-muted-foreground text-xs">
                  Подложки:{" "}
                  <code className="bg-muted rounded px-1 py-0.5">
                    --success / 12%
                  </code>{" "}
                  ·{" "}
                  <code className="bg-muted rounded px-1 py-0.5">
                    --secondary
                  </code>{" "}
                  ·{" "}
                  <code className="bg-muted rounded px-1 py-0.5">
                    outline --destructive
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- ROW 3: Hero + Tokens --- */}
          <div className="lg:col-span-7">
            <div className="from-primary via-primary/95 to-primary/80 text-primary-foreground relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 sm:p-10">
              <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-3xl" />
              <div className="text-primary-foreground/80 mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em]">
                Бюро Глагол
              </div>
              <h2 className="font-display max-w-md text-3xl font-extrabold leading-[1.02] tracking-tight sm:text-4xl">
                Календарь для
                <span className="block font-extrabold">продаж и тренеров</span>
              </h2>
              <p className="text-primary-foreground/85 mt-3 max-w-md text-sm leading-relaxed">
                Один источник правды для броней, услуг и нагрузки. amoCRM,
                Google Calendar и SMTP — на автомате.
              </p>
              <ul className="mt-5 flex flex-col gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4" /> Подтверждение брони одним
                  кликом
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4" /> Drag&drop в календаре и
                  канбане
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4" /> Серии воркшопов и гибридный
                  формат
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-display text-base">
                  CSS-переменные
                </CardTitle>
                <CardDescription>
                  Скопируй в <code>:root</code> любого проекта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-foreground text-background overflow-auto rounded-xl p-4 font-mono text-[11px] leading-relaxed">
                  <code>{TOKEN_SNIPPET}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="text-muted-foreground mx-auto mt-14 max-w-6xl border-t pt-6 text-xs">
          Бюро Глагол · Дизайн-система v1.2 · собрано на Next.js 16, Tailwind 4
          и shadcn/ui
        </footer>
      </div>
    </TooltipProvider>
  );
}

/* ============== вспомогательные блоки ============== */

function TypeRow({
  sample,
  meta,
}: {
  sample: React.ReactNode;
  meta: string;
}) {
  return (
    <div className="border-border bg-card flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
      <div className="min-w-0 truncate">{sample}</div>
      <div className="text-muted-foreground shrink-0 font-mono text-[10.5px] uppercase tracking-wider">
        {meta}
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  delta,
  tone = "default",
}: {
  label: string;
  value: number;
  delta: string;
  tone?: "default" | "success" | "warning";
}) {
  const toneCls =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : "text-muted-foreground";
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <div className="text-muted-foreground text-[10.5px] font-extrabold uppercase tracking-[0.14em]">
        {label}
      </div>
      <div className="font-display mt-1 text-2xl font-extrabold leading-none tracking-tight">
        {value}
      </div>
      <div className={`mt-1 text-xs ${toneCls}`}>{delta} к плану</div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "success" | "warning";
}) {
  const trackCls =
    tone === "success"
      ? "[&>div]:bg-success"
      : tone === "warning"
        ? "[&>div]:bg-warning"
        : "[&>div]:bg-primary";
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <Progress value={value} className={`h-2 ${trackCls}`} />
    </div>
  );
}

function StatusPill({
  status,
}: {
  status: "confirmed" | "pre" | "cancelled";
}) {
  if (status === "confirmed")
    return (
      <Badge className="bg-success/15 text-success border-success/30 border">
        Подтверждено
      </Badge>
    );
  if (status === "pre")
    return <Badge variant="secondary">Предварительно</Badge>;
  return <Badge variant="destructive">Отменено</Badge>;
}

function CalChip({
  status,
  time,
  title,
  who,
}: {
  status: "confirmed" | "pre" | "conflict";
  time: string;
  title: string;
  who: string;
}) {
  const tone =
    status === "confirmed"
      ? "border-l-success bg-success/10"
      : status === "pre"
        ? "border-l-muted-foreground bg-muted"
        : "border-l-destructive bg-card outline outline-2 outline-destructive";
  return (
    <div className={`rounded-md border-l-4 px-3 py-2 ${tone}`}>
      <div className="text-sm font-semibold">
        {time} · {title}
      </div>
      <div className="text-muted-foreground text-xs">{who}</div>
    </div>
  );
}

/* ============== данные ============== */

const BOOKINGS: {
  id: string;
  date: string;
  title: string;
  trainer: string;
  format: string;
  status: "confirmed" | "pre" | "cancelled";
}[] = [
  {
    id: "1",
    date: "18.05",
    title: "Воркшоп продажи",
    trainer: "Анна Иванова",
    format: "Офлайн · СПб",
    status: "confirmed",
  },
  {
    id: "2",
    date: "21.05",
    title: "Лидерство 2.0",
    trainer: "Пётр Сидоров",
    format: "Онлайн",
    status: "pre",
  },
  {
    id: "3",
    date: "27.05",
    title: "Стратегия Q3",
    trainer: "Мария Кравцова",
    format: "Гибрид",
    status: "confirmed",
  },
  {
    id: "4",
    date: "03.06",
    title: "Onboarding",
    trainer: "Анна Иванова",
    format: "Офлайн · Москва",
    status: "cancelled",
  },
];

const TOKEN_SNIPPET = `:root {
  /* Бренд */
  --background: oklch(0.97 0 0);   /* paper  #F6F6F6 */
  --foreground: oklch(0.18 0 0);   /* ink    #1A1A1A */
  --card:       oklch(0.99 0 0);   /* surface #FCFCFC */

  /* Акценты */
  --primary:    oklch(0.68 0.21 38);  /* #FF5C00 */
  --accent:     oklch(0.87 0.06 50);  /* #F8CFB8 */

  /* Семантика */
  --success:     oklch(0.69 0.16 145); /* #3FBF6A */
  --warning:     oklch(0.59 0.14 55);  /* #C76A00 */
  --destructive: oklch(0.51 0.20 27);  /* #B42318 */

  /* Радиус */
  --radius: 0.9rem;
}`;
