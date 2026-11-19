import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/reveal";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("mx-auto w-full max-w-6xl px-5 sm:px-6", className)}>{children}</div>;
}

type ButtonVariant = "primary" | "light" | "lime";
type ButtonSize = "sm" | "md" | "lg";

// Sticker press: hover lifts toward the light, active squashes flat onto its shadow.
const buttonBase =
  "group/btn inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full border-2 border-ink font-bold tracking-tight select-none shadow-pop transition-[transform,box-shadow,background-color] duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-x-1 active:translate-y-1 active:shadow-none";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  light: "bg-white text-ink",
  lime: "bg-lime text-ink",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm shadow-pop-sm hover:shadow-pop lg:h-10",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-7 text-[17px]",
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize; arrow?: boolean }) {
  return (
    <Link className={clsx(buttonBase, buttonVariants[variant], buttonSizes[size], className)} {...props}>
      {children}
      {arrow && (
        <ArrowRight className="size-[1.05em] transition-transform duration-200 ease-out group-hover/btn:translate-x-1" strokeWidth={2.5} aria-hidden />
      )}
    </Link>
  );
}

/** Tilted sticker label. */
export function Eyebrow({ children, className = "bg-white" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "hover-wiggle inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-ink px-3.5 text-ink py-1 text-xs font-extrabold tracking-[0.12em] uppercase shadow-pop-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  marker = "var(--color-sun)",
  intro,
  dark,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  highlight?: ReactNode;
  marker?: string;
  intro?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={clsx("mx-auto max-w-3xl text-center", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={clsx("tracking-display mt-6 text-4xl leading-[1.02] sm:text-5xl lg:text-6xl", dark ? "text-white" : "text-ink")}>
        {title}
        {highlight && (
          <>
            {" "}
            <span className={clsx("marker", dark && "marker-full text-ink")} style={{ "--marker": marker } as CSSProperties}>
              {highlight}
            </span>
          </>
        )}
      </h2>
      {intro && <p className={clsx("mx-auto mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl", dark ? "text-white/70" : "text-ink-2")}>{intro}</p>}
    </Reveal>
  );
}

export function Stars({ className = "size-4" }: { className?: string }) {
  return (
    <span role="img" className="inline-flex gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" stroke="#1a1523" strokeWidth="1.2" className={className} aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}
