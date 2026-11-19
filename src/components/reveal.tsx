"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fires once when scrolled into view (marketing only). Visible without JS: only blocks below the fold get
 * hidden. With `stagger`, the wrapper stays put and children marked `data-item` (+ `--i`) enter in sequence.
 */
export function Reveal({
  children,
  className,
  stagger,
  as: Tag = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stagger?: boolean;
  as?: "div" | "ul" | "ol";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.setAttribute("data-pending", "");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.removeAttribute("data-pending");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -100px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} data-reveal="" data-stagger={stagger ? "" : undefined} className={className} style={style}>
      {children}
    </Tag>
  );
}
