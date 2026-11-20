"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * How the theme switch animates.
 * "snapshot" (v2): View Transitions API. The browser crossfades two screenshots on the GPU, so it stays smooth
 *   no matter how many elements the page has. Browsers without it switch instantly.
 * "css" (v1 backup): per-element colour transitions via .theme-anim in globals.css. Janky on a long page
 *   (~1,250 elements repainting every frame). Revert by setting this to "css".
 */
const FADE: "snapshot" | "css" = "snapshot";

// The <html data-theme> attribute (set before paint in layout.tsx) is the single source of truth.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    sessionStorage.setItem("theme", next);
  } catch {} // private mode: still switches, just isn't remembered
}

// v1 sticker styling; v2 passes its own className.
const STICKER =
  "grid size-11 shrink-0 place-items-center rounded-full text-ink-2 transition-[color,background-color,rotate] duration-300 ease-[var(--ease-spring)] hover:rotate-12 hover:bg-sun hover:text-ink lg:size-10";

/** Sun/moon switch. Light is the default; the visitor's pick lasts for this tab session. */
export function ThemeToggle({ className = STICKER }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);

  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        const html = document.documentElement;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return applyTheme(next);
        if (FADE === "snapshot") {
          if (document.startViewTransition) document.startViewTransition(() => applyTheme(next));
          else applyTheme(next);
          return;
        }
        html.classList.add("theme-anim"); // v1: smooth colour fade, removed once it's done
        window.setTimeout(() => html.classList.remove("theme-anim"), 350);
        applyTheme(next);
      }}
      aria-label={`Switch to ${next} theme`}
      className={className}
    >
      {theme === "dark" ? <Sun className="size-5" strokeWidth={2.25} aria-hidden /> : <Moon className="size-5" strokeWidth={2.25} aria-hidden />}
    </button>
  );
}
