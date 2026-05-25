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
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { PageShell, PageHeader } from "@/components/page-shell";
import { BrandLogo, Logo, type LogoVariant } from "@/components/brand";
import { Eyebrow, Small } from "@/components/typography";
import Link from "next/link";
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
import { SalesPlanProgress } from "@/components/dashboard-widgets";

/* =========================================================
   Глагол · Дизайн-система v1.3 · демо-страница
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
      <PageShell>
        <PageHeader
          size="hero"
          eyebrow="бюро Глагол · UI-кит веб-сервисов"
          title={
            <>
              Дизайн-система <span className="text-primary">v1.3</span>
            </>
          }
          description={
            <>
              Брендовые цвета, типографика, радиусы и компоненты, на которых
              собран портал бронирования и другие сервисы бюро Глагол.
              Источник правды —{" "}
              <code className="bg-muted rounded px-1.5 py-0.5 text-[0.85em]">
                app/globals.css
              </code>
              .
            </>
          }
        />
        <div className="-mt-4 mb-10 flex flex-wrap gap-2">
          <Badge className="bg-primary/15 text-primary border-primary/30 border">
            Оранж = акценты/CTA
          </Badge>
          <Badge className="bg-accent text-accent-foreground border-accent/40 border">
            Персик = декор-подложка
          </Badge>
          <Badge variant="secondary">Никогда чистый #000 / #fff</Badge>
          <Link
            href="/calendar"
            className="hover:border-primary hover:text-primary border-border bg-card flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
          >
            Календарь <ChevronRightIcon className="size-3" />
          </Link>
          <Link
            href="/dashboard"
            className="hover:border-primary hover:text-primary border-border bg-card flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
          >
            Дашборд <ChevronRightIcon className="size-3" />
          </Link>
        </div>

        {/* ========== Грид ========== */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* --- COL 1: токены, иконки, kpi --- */}
          <div className="flex flex-col gap-5 lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Логотип</CardTitle>
                <CardDescription>
                  Знак-стрелка «›» + слово «бюро Глагол». Четыре варианта на
                  разные фоны.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <LogoTile
                  variant="default"
                  bg="bg-[#F6F6F6]"
                  label="Основной"
                  note="Светлые фоны · по умолчанию"
                />
                <LogoTile
                  variant="black"
                  bg="bg-[#F6F6F6]"
                  label="Чёрный"
                  note="Моно/печать"
                />
                <LogoTile
                  variant="white-on-dark"
                  bg="bg-[#1A1A1A]"
                  label="На тёмном"
                  note="Hero / тёмный фон"
                  dark
                />
                <LogoTile
                  variant="mono-white"
                  bg="bg-primary"
                  label="На оранжевом"
                  note="Только бренд-сабстрат"
                  dark
                />
              </CardContent>
            </Card>

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
                        Внутренний портал · v1.3
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
                        Основной текст — Manrope, 14px.
                      </p>
                    }
                    meta="Body · 14/400"
                  />
                  <TypeRow
                    sample={
                      <p className="text-muted-foreground text-xs font-medium">
                        Название поля формы
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

            <SalesPlanProgress
              title="План"
              month="Май 2026"
              fact={3_420_000}
              pre={1_580_000}
              plan={7_800_000}
            />

            <Card>
              <CardHeader>
                <CardTitle>Список броней · май</CardTitle>
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
                        <TableCell className="text-xs tabular-nums">
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

            <Card>
              <CardHeader>
                <CardTitle>Состояния</CardTitle>
                <CardDescription>
                  Hover, focus, active, disabled, loading. Кликабельные карточки
                  через{" "}
                  <code className="bg-muted rounded px-1 text-[0.85em]">
                    interactive
                  </code>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Кнопки</Eyebrow>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button>Default</Button>
                    <Button className="hover:bg-primary/90 ring-primary/40 ring-2">
                      Hover
                    </Button>
                    <Button className="ring-ring/60 ring-2">Focus</Button>
                    <Button disabled>Disabled</Button>
                    <Button disabled>
                      <Spinner />
                      Loading
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Поля ввода</Eyebrow>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input placeholder="Default" />
                    <Input
                      placeholder="Focus"
                      className="ring-ring/60 border-ring ring-2"
                    />
                    <Input
                      placeholder="Disabled"
                      disabled
                      defaultValue="Артём Гусев"
                    />
                    <Input
                      placeholder="Error"
                      aria-invalid="true"
                      className="border-destructive ring-destructive/40 ring-2"
                      defaultValue="Невалидное значение"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Кликабельные карточки</Eyebrow>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Card interactive size="sm">
                      <CardHeader>
                        <CardTitle>Карточка проекта</CardTitle>
                        <CardDescription>
                          Hover, чтобы увидеть состояние
                        </CardDescription>
                      </CardHeader>
                    </Card>
                    <Card interactive size="sm">
                      <CardHeader>
                        <CardTitle>Карточка тренера</CardTitle>
                        <CardDescription>
                          Курсор pointer + ring + lift
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="from-primary via-primary/95 to-primary/80 text-primary-foreground relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 sm:p-10">
              <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10 blur-3xl" />
              <div className="text-primary-foreground/80 mb-3 text-xs font-medium">
                бюро Глагол
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

          {/* --- COL 2: кнопки, форма, поиск --- */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>Кнопки</CardTitle>
                <CardDescription>
                  Варианты, размеры, с иконкой. Меняйте в одном месте — обновится по всему интерфейсу.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Варианты</Eyebrow>
                  <div className="flex flex-wrap gap-2">
                    <Button>
                      <PlusIcon /> Бронь
                    </Button>
                    <Button variant="secondary">Отмена</Button>
                    <Button variant="outline">Редактировать</Button>
                    <Button variant="ghost">Подробнее</Button>
                    <Button variant="destructive">Удалить</Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Размеры</Eyebrow>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm">Маленькая</Button>
                    <Button>По умолчанию</Button>
                    <Button size="lg">Крупная</Button>
                    <Button size="icon" aria-label="Добавить">
                      <PlusIcon />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Состояния</Eyebrow>
                  <div className="flex flex-wrap gap-2">
                    <Button disabled>Disabled</Button>
                    <Button disabled>
                      <Spinner />
                      Loading
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Бейджи и статусы</CardTitle>
                <CardDescription>
                  Пилюли для статусов броней, проектов, ролей
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                <CardTitle>Переключатели</CardTitle>
                <CardDescription>
                  Switch, Checkbox — для тумблеров настроек и выбора
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Switch</Eyebrow>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-2">
                      <Switch id="sw-on" defaultChecked />
                      <Label htmlFor="sw-on" className="cursor-pointer">
                        Включён
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="sw-off" />
                      <Label htmlFor="sw-off" className="cursor-pointer">
                        Выключен
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="sw-dis" disabled />
                      <Label
                        htmlFor="sw-dis"
                        className="text-muted-foreground cursor-not-allowed"
                      >
                        Отключён
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Checkbox</Eyebrow>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="cb-on" defaultChecked />
                      <Label htmlFor="cb-on" className="cursor-pointer">
                        Отмечен
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cb-off" />
                      <Label htmlFor="cb-off" className="cursor-pointer">
                        Снят
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cb-dis" disabled />
                      <Label
                        htmlFor="cb-dis"
                        className="text-muted-foreground cursor-not-allowed"
                      >
                        Отключён
                      </Label>
                    </div>
                  </div>
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
                        <SelectItem value="anna">Юля Глазкова</SelectItem>
                        <SelectItem value="petr">Андрей Суворков</SelectItem>
                        <SelectItem value="maria">Сабина Алиева</SelectItem>
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
                    <span className="text-muted-foreground text-xs tabular-nums">
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

            <Card>
              <CardHeader>
                <CardTitle>Выпадающие списки</CardTitle>
                <CardDescription>
                  Ширина списка ровно равна ширине триггера
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Стандартный</Eyebrow>
                  <Select defaultValue="anna">
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тренера" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anna">Юля Глазкова</SelectItem>
                      <SelectItem value="petr">Андрей Суворков</SelectItem>
                      <SelectItem value="maria">Сабина Алиева</SelectItem>
                      <SelectItem value="lena">Лена Жукова</SelectItem>
                      <SelectItem value="artem">Артём Гусев</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Узкий</Eyebrow>
                  <Select defaultValue="offline">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Офлайн</SelectItem>
                      <SelectItem value="online">Онлайн</SelectItem>
                      <SelectItem value="hybrid">Гибрид</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Отключён</Eyebrow>
                  <Select disabled defaultValue="confirmed">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Подтверждено</SelectItem>
                      <SelectItem value="pre">Предварительно</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Аватары</CardTitle>
                <CardDescription>
                  Группа тренеров, размеры sm/default/lg, статусы
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Команда</Eyebrow>
                  <div className="flex items-center gap-3">
                    <AvatarGroup>
                      <Avatar>
                        <AvatarFallback className="text-[11px] font-semibold">
                          ЮГ
                        </AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback className="text-[11px] font-semibold">
                          АС
                        </AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback className="text-[11px] font-semibold">
                          СА
                        </AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback className="text-[11px] font-semibold">
                          ЛЖ
                        </AvatarFallback>
                      </Avatar>
                      <AvatarGroupCount>+5</AvatarGroupCount>
                    </AvatarGroup>
                    <Small>9 активных тренеров</Small>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Eyebrow tone="muted">Размеры</Eyebrow>
                  <div className="flex items-end gap-4">
                    <Avatar size="sm">
                      <AvatarFallback className="text-[10px]">АГ</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback className="text-xs">АГ</AvatarFallback>
                    </Avatar>
                    <Avatar size="lg">
                      <AvatarFallback className="text-sm font-semibold">
                        АГ
                      </AvatarFallback>
                    </Avatar>
                    <Avatar size="lg" className="relative">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        ЮГ
                      </AvatarFallback>
                      <AvatarBadge className="bg-success size-2.5" />
                    </Avatar>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Eyebrow tone="muted">С фото</Eyebrow>
                  <div className="flex items-center gap-3">
                    <AvatarGroup>
                      <Avatar size="lg">
                        <AvatarImage
                          src="/photos/trainer-01.jpg"
                          alt="Артём Гусев"
                        />
                        <AvatarFallback className="text-xs font-semibold">
                          АГ
                        </AvatarFallback>
                      </Avatar>
                      <Avatar size="lg">
                        <AvatarFallback className="text-xs font-semibold">
                          ЮГ
                        </AvatarFallback>
                      </Avatar>
                      <Avatar size="lg">
                        <AvatarFallback className="text-xs font-semibold">
                          АС
                        </AvatarFallback>
                      </Avatar>
                      <Avatar size="lg">
                        <AvatarFallback className="text-xs font-semibold">
                          СА
                        </AvatarFallback>
                      </Avatar>
                    </AvatarGroup>
                    <Small>Если есть фото — показываем; иначе инициалы</Small>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Чипы календаря</CardTitle>
                <CardDescription>
                  Цветной левый бордер маркирует статус
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <CalChip
                  status="confirmed"
                  time="18:00"
                  title="Воркшоп продажи"
                  who="Юля Глазкова"
                />
                <CalChip
                  status="pre"
                  time="10:00"
                  title="Лидерство 2.0"
                  who="Андрей Суворков"
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

            <Card>
              <CardHeader>
                <CardTitle>Empty · Loading</CardTitle>
                <CardDescription>
                  Пустые состояния и скелетоны для загрузки
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="border-border bg-card flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-8 text-center">
                  <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
                    <CalendarIcon className="size-5" />
                  </div>
                  <div className="font-display text-sm font-bold">
                    Нет броней
                  </div>
                  <p className="text-muted-foreground max-w-[28ch] text-xs">
                    На эту неделю нет запланированных событий.
                  </p>
                  <Button size="sm" variant="outline">
                    <PlusIcon />
                    Добавить
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  <Eyebrow tone="muted">Skeleton</Eyebrow>
                  <div className="grid gap-2">
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-5/6 rounded-md" />
                    <div className="mt-2 flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-32 rounded-md" />
                        <Skeleton className="h-2.5 w-20 rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CSS-переменные</CardTitle>
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


        <footer className="text-muted-foreground mt-14 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs">
          <div className="flex items-center gap-3">
            <BrandLogo size={24} withText={false} />
            <span>
              бюро Глагол · Дизайн-система v1.3 · Next.js 16, Tailwind 4,
              shadcn/ui
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/calendar" className="hover:text-foreground">
              Календарь
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Дашборд
            </Link>
          </div>
        </footer>
      </PageShell>
    </TooltipProvider>
  );
}

/* ============== вспомогательные блоки ============== */

function LogoTile({
  variant,
  bg,
  label,
  note,
  dark,
}: {
  variant: LogoVariant;
  bg: string;
  label: string;
  note: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-black/10 ${bg} p-4`}
    >
      <div className="flex h-16 items-center justify-start">
        <Logo variant={variant} className="h-7 w-auto" />
      </div>
      <div>
        <div
          className={`text-sm font-extrabold ${
            dark ? "text-white" : "text-[#1A1A1A]"
          }`}
        >
          {label}
        </div>
        <div
          className={`text-[11px] ${
            dark ? "text-white/70" : "text-[#1A1A1A]/60"
          }`}
        >
          {note}
        </div>
      </div>
    </div>
  );
}

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
      <div className="text-muted-foreground shrink-0 text-xs font-medium">
        {meta}
      </div>
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
    trainer: "Юля Глазкова",
    format: "Офлайн · СПб",
    status: "confirmed",
  },
  {
    id: "2",
    date: "21.05",
    title: "Лидерство 2.0",
    trainer: "Андрей Суворков",
    format: "Онлайн",
    status: "pre",
  },
  {
    id: "3",
    date: "27.05",
    title: "Стратегия Q3",
    trainer: "Сабина Алиева",
    format: "Гибрид",
    status: "confirmed",
  },
  {
    id: "4",
    date: "03.06",
    title: "Onboarding",
    trainer: "Юля Глазкова",
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
