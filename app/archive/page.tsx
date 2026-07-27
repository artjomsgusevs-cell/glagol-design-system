import { Check, CheckCircle2, CalendarClock, Clock, Mail, Video } from "lucide-react";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/page-shell";
import { Eyebrow } from "@/components/typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step } from "@/components/booking/step";
import { CopyLink } from "@/components/booking/copy-link";

export const metadata = { title: "Архив · дизайн-система бюро Глагол" };

/**
 * Что было раньше.
 *
 * Эталон показывает только то, что в продукте сейчас, — иначе он перестаёт
 * быть эталоном. Но прошлые версии стоит держать под рукой: спор «а раньше
 * было лучше» решается взглядом, а не памятью, и откатить проще, когда
 * есть куда.
 *
 * Правило: сюда кладут снимок кода на момент замены, не трогая его потом.
 * Это музей, а не рабочая копия — если версия отсюда снова понадобится, её
 * переносят в продукт и уже там правят.
 */
export default function ArchivePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Архив"
        title="Прошлые версии"
        description="Снимки экранов на момент замены. В продукте их больше нет — здесь они лежат на случай, если решим вернуться."
      />

      <div className="section-rule">
        <span>
          <b>27.07.2026</b> · Экран после записи
        </span>
      </div>

      <p className="text-muted-foreground max-w-2xl text-sm">
        Заменён на{" "}
        <Link href="/booking" className="text-foreground font-semibold underline-offset-4 hover:underline">
          общий экран с двумя состояниями
        </Link>
        . Причины по каждой версии — под образцом.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Витрина: «Время закреплено»</CardTitle>
            <CardDescription>
              Жил на странице записи мини-аппа до 27 июля 2026.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/40 rounded-3xl p-4 sm:p-6">
              <div className="bg-card border-border mx-auto w-full max-w-[380px] rounded-3xl border p-6 text-center">
                <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-full">
                  <CheckCircle2 className="text-primary size-8" />
                </div>
                <h2 className="font-display mt-4 text-2xl font-extrabold tracking-tight">
                  Время закреплено
                </h2>
                <p className="text-muted-foreground mt-2 text-sm">
                  Вторник, 28 июля, 10:00 · Венера Шакирова
                </p>
                <p className="text-muted-foreground mt-3 text-sm">
                  Приглашение в календарь и счёт придут на{" "}
                  <span className="text-foreground font-medium">artjom@example.com</span>. Тренер
                  получит приглашение тоже.
                </p>

                <div className="bg-card border-border mt-6 rounded-2xl border p-4 text-left">
                  <div className="text-sm font-semibold">Расскажите о выступлении подробнее</div>
                  <p className="text-muted-foreground mt-1 text-sm leading-snug">
                    Пять минут сейчас — и тренер придёт на встречу, уже зная вашу задачу. Можно
                    заполнить позже, до консультации.
                  </p>
                  <span className="bg-primary text-primary-foreground mt-3 flex h-11 w-full items-center justify-center rounded-full font-semibold">
                    Заполнить бриф
                  </span>
                </div>

                <div className="text-muted-foreground mt-4 text-sm">Вернуться к тренерам</div>
              </div>
            </div>

            <div className="border-border mt-4 border-t pt-4">
              <Eyebrow tone="muted">Почему заменили</Eyebrow>
              <ul className="text-muted-foreground mt-2 space-y-1.5 text-sm">
                <li>Ссылки на встречу не было вовсе — её искали в письме.</li>
                <li>Ничего не говорило, что делать, если планы изменятся.</li>
                <li>«Вернуться к тренерам» уводило от единственного полезного действия.</li>
                <li>Экран не совпадал со страницей записи тренера — два разных бюро.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Календарь: «Записались»</CardTitle>
            <CardDescription>Первый общий стандарт, до сведения с витриной.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/40 rounded-3xl p-4 sm:p-6">
              <div className="bg-card border-border mx-auto w-full max-w-[380px] rounded-3xl border p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-full">
                    <Check className="text-primary size-6" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-display text-2xl leading-tight font-extrabold tracking-tight">
                      Записались
                    </h1>
                    <p className="text-muted-foreground truncate text-sm">
                      Консультация · Артём Гусев
                    </p>
                  </div>
                </div>

                <div className="bg-muted/60 mt-6 rounded-2xl p-4">
                  <div className="text-lg font-semibold">30 июля (чт), 15:00</div>
                  <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
                    <Clock className="size-3.5" />
                    60 минут · Москва
                  </div>
                </div>

                <ol className="mt-6 space-y-4">
                  <Step icon={<Video className="size-4" />} title="Где встречаемся">
                    <span className="text-primary break-all">https://us02web.zoom.us/j/8398…</span>
                  </Step>
                  <Step icon={<Mail className="size-4" />} title="Письмо">
                    Приглашение уже отправлено вам на почту — artjom@example.com. Не пришло:
                    загляните в «Промоакции» и спам.
                  </Step>
                  <Step icon={<CalendarClock className="size-4" />} title="Если планы изменятся">
                    Перенести или отменить можно по ссылке ниже — она только ваша, сохраните её.
                  </Step>
                </ol>

                <div className="mt-6 space-y-3">
                  <span className="bg-foreground text-background flex h-12 w-full items-center justify-center gap-2 rounded-full font-semibold">
                    <CalendarClock className="size-5" />
                    Управлять записью
                  </span>
                  <CopyLink url="https://calendar.glagol.me/b/1a739d693a…" compact />
                </div>
              </div>
            </div>

            <div className="border-border mt-4 border-t pt-4">
              <Eyebrow tone="muted">Почему заменили</Eyebrow>
              <ul className="text-muted-foreground mt-2 space-y-1.5 text-sm">
                <li>Ссылка на комнату стояла перед письмом, в котором она же и лежит.</li>
                <li>Ссылка с копированием вела туда же, куда кнопка над ней.</li>
                <li>Оранжевая «Скопировать» была третьим акцентом на экране.</li>
                <li>«Записались» и «Время забронировано» — два слова про одно и то же.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
