"use client";

import { useState } from "react";
import clsx from "clsx";
import { MapBackdrop, gridStats, rankTone, type RankValue } from "@/components/rank-grid";
import { DOT_TONE } from "@/components/v2/dot-tone";


/**
 * v2 rank map: one card, a Week 1 / Week 8 switch the visitor controls, and the two numbers that matter.
 * No autoplay; the only motion is the dots changing colour when the visitor switches.
 */
export function RankMap({ before, after, keyword }: { before: RankValue[][]; after: RankValue[][]; keyword: string }) {
  const [week, setWeek] = useState<"before" | "after">("after");
  const grid = week === "after" ? after : before;
  const stats = gridStats(grid);
  const n = grid.length;
  const mid = (n - 1) / 2;

  return (
    <figure className="rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgb(16_24_40/0.04),0_12px_32px_-12px_rgb(16_24_40/0.12)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">“{keyword}”</p>
          <p className="text-xs text-muted">Sample scan · 49 points around the business</p>
        </div>
        <div role="group" aria-label="Choose scan week" className="flex rounded-lg border border-line bg-subtle p-0.5 text-xs font-semibold">
          {(
            [
              ["before", "Week 1"],
              ["after", "Week 8"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={week === key}
              onClick={() => setWeek(key)}
              className={clsx(
                "min-h-9 rounded-md px-3 transition-colors duration-150",
                week === key ? "bg-surface text-fg shadow-sm ring-1 ring-line" : "text-muted hover:text-fg",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 aspect-square overflow-hidden rounded-xl border border-line">
        <MapBackdrop />
        <div className="relative grid size-full place-items-center p-[4%]" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {grid.flatMap((row, r) =>
            row.map((rank, c) => (
              <span
                key={`${r}-${c}`}
                className={clsx(
                  "grid aspect-square w-[76%] place-items-center rounded-full text-[clamp(9px,2.4vw,13px)] font-semibold tabular-nums shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-colors duration-300",
                  DOT_TONE[rankTone(rank)],
                  r === mid && c === mid && "ring-2 ring-fg ring-offset-2 ring-offset-white/80",
                )}
              >
                {rank ?? "20+"}
              </span>
            )),
          )}
        </div>
      </div>

      <figcaption className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-subtle px-4 py-3">
          <p className="text-xs text-muted">Spots in the top 3</p>
          <p className="mt-0.5 text-xl font-semibold text-fg tabular-nums">
            {stats.top3}
            <span className="text-sm font-medium text-muted"> / {stats.total}</span>
          </p>
        </div>
        <div className="rounded-xl border border-line bg-subtle px-4 py-3">
          <p className="text-xs text-muted">Average position</p>
          <p className="mt-0.5 text-xl font-semibold text-fg tabular-nums">{stats.avg}</p>
        </div>
        <p className="sr-only" aria-live="polite">
          {week === "after" ? "Week 8" : "Week 1"}: {stats.top3} of {stats.total} spots in the top 3, average position {stats.avg}.
        </p>
      </figcaption>
    </figure>
  );
}
