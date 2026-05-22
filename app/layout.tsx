import type { Metadata } from "next";
import { Wix_Madefor_Text, Wix_Madefor_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Wix_Madefor_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const fontDisplay = Wix_Madefor_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Дизайн-система · бюро Глагол v1.2",
  description:
    "Полная выкладка дизайн-системы внутреннего портала бюро Глагол: токены, типографика, кнопки, инпуты, статусы, чарты и компоненты.",
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
