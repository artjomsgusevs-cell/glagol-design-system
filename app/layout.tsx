import type { Metadata } from "next";
import { Manrope, Onest } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

/**
 * Кириллица v1.3: Manrope (text) + Onest (display).
 * Manrope — открытая «г», прямая «д», ровные «к/ж» — чище чем Wix Madefor.
 * Onest — гротеск с акцентом для заголовков. Оба специально оптимизированы под кириллицу.
 */
const fontSans = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Дизайн-система · бюро Глагол v1.3",
  description:
    "UI-кит для веб-сервисов бюро Глагол: токены, типографика, кнопки, инпуты, статусы, экраны календаря и дашборда.",
  icons: {
    // app/icon.png (оранжевая) подхватывается Next автоматически как дефолт.
    // Через media-query — переключаем на чёрный при тёмной теме браузера.
    icon: [
      { url: "/favicon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/favicon-light.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body className="antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
