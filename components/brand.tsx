/**
 * Бренд бюро Глагол — знак-стрелка и полный логотип
 * для дизайн-системы. Привязан к shadcn-токенам.
 */

import type { CSSProperties } from "react";

/** Фирменный знак — одиночный чистый шеврон «›». Цвет = currentColor. */
export function Mark({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="5 17 32 47"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="m19.12,18.24c-.07-.1-.19-.16-.31-.16H6.21c-.31,0-.49.35-.31.6l16.52,21.67c.09.13.09.3,0,.44L5.9,62.45c-.18.25,0,.6.31.6h12.63c.12,0,.24-.06.31-.16l16.77-22.09c.09-.13.09-.3,0-.43l-16.79-22.12Z"
      />
    </svg>
  );
}

/**
 * Полный логотип «› бюро Глагол». Варианты:
 *  default        — оранжевый шеврон + ink-текст (основной, для светлых фонов)
 *  black          — полностью чёрный (моно/печать)
 *  mono-white     — полностью белый (для тёмных однотонных фонов)
 *  white-on-dark  — белый текст + оранжевый шеврон (для брендовой тёмной подложки)
 */
export type LogoVariant = "default" | "black" | "mono-white" | "white-on-dark";

const LOGO_SRC: Record<LogoVariant, string> = {
  default: "/brand/logo-default.svg",
  black: "/brand/logo-black.svg",
  "mono-white": "/brand/logo-mono-white.svg",
  "white-on-dark": "/brand/logo-white-on-dark.svg",
};

export function Logo({
  className,
  variant = "default",
  style,
}: {
  className?: string;
  variant?: LogoVariant;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC[variant]}
      alt="бюро Глагол"
      className={className}
      style={style}
      draggable={false}
    />
  );
}

/**
 * Композит-логотип: оранжевая плитка-знак с белым шевроном внутри +
 * текст «бюро Глагол».
 */
export function BrandLogo({
  className,
  style,
  size = 32,
  withText = true,
}: {
  className?: string;
  style?: CSSProperties;
  /** Размер плитки-знака в px (текст и расстояния масштабируются от него). */
  size?: number;
  withText?: boolean;
}) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(size * 0.3),
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          background: "var(--primary)",
          borderRadius: Math.round(size * 0.28),
          flexShrink: 0,
        }}
      >
        <Mark
          style={{
            width: Math.round(size * 0.4),
            height: Math.round(size * 0.6),
            color: "var(--primary-foreground)",
          }}
        />
      </span>
      {withText && (
        <span
          className="font-display"
          style={{
            fontSize: Math.round(size * 0.5),
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "var(--foreground)",
            lineHeight: 1,
          }}
        >
          бюро Глагол
        </span>
      )}
    </span>
  );
}
