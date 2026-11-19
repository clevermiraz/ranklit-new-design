"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

// The <html data-theme> attribute (set before paint in layout.tsx) is the single source of truth.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

/** Sun/moon switch. Light is the default; the visitor's pick is remembered. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);

  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        const html = document.documentElement;
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
          html.classList.add("theme-anim"); // smooth colour fade, removed once it's done
          window.setTimeout(() => html.classList.remove("theme-anim"), 350);
        }
        html.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {} // private mode: still switches, just isn't remembered
      }}
      aria-label={`Switch to ${next} theme`}
      className="grid size-11 shrink-0 place-items-center rounded-full text-ink-2 transition-[color,background-color,rotate] duration-300 ease-[var(--ease-spring)] hover:rotate-12 hover:bg-sun hover:text-ink lg:size-10"
    >
      {theme === "dark" ? <Sun className="size-5" strokeWidth={2.25} aria-hidden /> : <Moon className="size-5" strokeWidth={2.25} aria-hidden />}
    </button>
  );
}
