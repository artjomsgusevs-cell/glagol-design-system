"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Обзор" },
  { href: "/calendar", label: "Календарь" },
  { href: "/dashboard", label: "Дашборд" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="mx-auto mb-8 flex max-w-6xl flex-wrap items-center justify-between gap-3">
      <Link href="/" className="shrink-0">
        <Logo variant="default" className="h-7 w-auto dark:hidden" />
        <Logo
          variant="white-on-dark"
          className="hidden h-7 w-auto dark:block"
        />
      </Link>

      <nav className="bg-card border-border order-3 flex w-full items-center gap-1 rounded-full border p-1 sm:order-2 sm:w-auto">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="order-2 flex items-center gap-2 sm:order-3">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          v1.3.2 · Next 16 · Tailwind 4
        </Badge>
        <ThemeToggle />
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
    </header>
  );
}
