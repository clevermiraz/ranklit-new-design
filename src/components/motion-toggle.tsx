"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

/** Pause/play for every looping animation on the page (WCAG 2.2.2). Sets data-motion on <html>; CSS does the rest. */
export function MotionToggle() {
  const [paused, setPaused] = useState(false);
  function toggle() {
    const next = !paused;
    setPaused(next);
    if (next) document.documentElement.setAttribute("data-motion", "paused");
    else document.documentElement.removeAttribute("data-motion");
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      className="absolute top-1/2 right-3 z-10 flex min-h-11 -translate-y-1/2 items-center gap-1.5 rounded-full border-2 border-lime bg-night px-3 text-xs font-bold text-lime transition-colors duration-150 hover:bg-lime hover:text-ink sm:right-6"
    >
      {paused ? <Play className="size-3.5 fill-current" aria-hidden /> : <Pause className="size-3.5 fill-current" aria-hidden />}
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}
