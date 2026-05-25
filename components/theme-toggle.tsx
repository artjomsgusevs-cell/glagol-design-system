"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Переключатель темы. Иконка-кнопка в SiteNav.
 * Хоткей `d` уже привязан в ThemeProvider.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-8 rounded-full"
      aria-label={isDark ? "Светлая тема" : "Тёмная тема"}
      title="Переключить тему · D"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Чтобы избежать гидрационного скачка, рендерим обе иконки и переключаем через классы */}
      <SunIcon
        className={`size-4 transition-all ${isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"} absolute`}
      />
      <MoonIcon
        className={`size-4 transition-all ${isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"} absolute`}
      />
    </Button>
  );
}
