"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { RotateCcw } from "lucide-react";
import { MapBackdrop, gridStats, rankTone, toneClass, type RankValue } from "@/components/rank-grid";

const STEP_MS = 110; // delay per grid step of distance from the centre, so the scan ripples outward
const SETTLE_MS = 900; // stats swap once the furthest dots have landed

/**
 * Explains the product: a scan sweeps out from your location and each spot flips to its new rank.
 * Runs once when half visible; "Replay" re-runs it. Reset is instant, the reveal is the only motion.
 */
export function RankScan({ before, after, keyword }: { before: RankValue[][]; after: RankValue[][]; keyword: string }) {
  const [scanned, setScanned] = useState(false);
  const [run, setRun] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const n = after.length;
  const mid = (n - 1) / 2;
  const b = gridStats(before);
  const a = gridStats(after);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScanned(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function replay() {
    setScanned(false);
    setRun((r) => r + 1);
    // two frames: let the reset paint before the scan starts again
    requestAnimationFrame(() => requestAnimationFrame(() => setScanned(true)));
  }

  return (
    <div ref={ref} className="rounded-[28px] border-2 border-ink bg-white p-3 shadow-pop-lg sm:p-4">
      <div className="flex items-center justify-between gap-3 px-2 pt-1 pb-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">“{keyword}”</p>
          <p className="text-xs text-ink-2">Sample scan · 49 points around you</p>
        </div>
        <Swap on={scanned} delay={SETTLE_MS} className="shrink-0 text-xs font-bold">
          <span className="rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 text-ink">Week 1</span>
          <span className="rounded-full border-2 border-ink bg-lime px-2.5 py-0.5 text-ink">Week 8</span>
        </Swap>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-[20px] border-2 border-ink">
        <MapBackdrop />
        <div className="relative grid size-full place-items-center p-[4%]" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {after.flatMap((row, r) =>
            row.map((rank, c) => {
              const delay = Math.round(Math.hypot(r - mid, c - mid) * STEP_MS);
              const prev = before[r][c];
              const centre = r === mid && c === mid;
              return (
                <span key={`${r}-${c}`} className={clsx("relative aspect-square w-[78%] rounded-full", centre && "ring-2 ring-night ring-offset-2 ring-offset-white/70")}>
                  <Dot rank={prev} />
                  <Dot
                    rank={rank}
                    className={clsx(
                      "transition-[opacity,transform] duration-400 ease-out",
                      scanned ? "scale-100 opacity-100" : "scale-90 opacity-0 duration-0",
                    )}
                    style={{ transitionDelay: scanned ? `${delay}ms` : "0ms" }}
                  />
                </span>
              );
            }),
          )}
        </div>
        {scanned && (
          <span
            key={run}
            className="animate-ping-once pointer-events-none absolute inset-0 m-auto aspect-square w-full rounded-full border-2 border-brand-600 bg-brand-400/15"
            aria-hidden
          />
        )}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_1fr_auto] items-center gap-2">
        <Stat label="Top-3 spots" on={scanned} from={`${b.top3}/49`} to={`${a.top3}/49`} />
        <Stat label="Average rank" on={scanned} from={String(b.avg)} to={String(a.avg)} />
        <button
          type="button"
          onClick={replay}
          className="flex h-full items-center gap-1.5 rounded-2xl border-2 border-ink bg-sun px-4 text-sm font-bold text-ink shadow-pop-sm transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-pop active:translate-y-0.5 active:shadow-none"
        >
          <RotateCcw className="size-4" aria-hidden /> Replay
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {scanned ? `Week 8: top 3 in ${a.top3} of 49 spots, average rank ${a.avg}.` : ""}
      </p>
    </div>
  );
}

function Dot({ rank, className, style }: { rank: RankValue; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={clsx(
        "absolute inset-0 grid place-items-center rounded-full text-[10px] font-bold shadow-[0_2px_6px_rgb(0_0_0/0.2)] ring-2 ring-ink sm:text-[13px]",
        toneClass[rankTone(rank)],
        className,
      )}
      style={style}
      aria-hidden
    >
      {rank === null ? "20+" : rank}
    </span>
  );
}

/** Crossfades two stacked children; the second shows when `on`, after `delay`. */
function Swap({ on, delay, className, children }: { on: boolean; delay: number; className?: string; children: [React.ReactNode, React.ReactNode] }) {
  const t = (show: boolean) =>
    clsx("col-start-1 row-start-1 transition-opacity", on ? "duration-300 ease-out" : "duration-0", show ? "opacity-100" : "opacity-0");
  const style = { transitionDelay: on ? `${delay}ms` : "0ms" };
  return (
    <span className={clsx("inline-grid justify-items-end", className)}>
      <span className={t(!on)} style={style}>{children[0]}</span>
      <span className={t(on)} style={style} aria-hidden={!on}>{children[1]}</span>
    </span>
  );
}

function Stat({ label, on, from, to }: { label: string; on: boolean; from: string; to: string }) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-paper px-4 py-2.5">
      <p className="text-xs text-ink-2">{label}</p>
      <Swap on={on} delay={SETTLE_MS} className="mt-0.5 justify-items-start text-xl font-extrabold tracking-tight text-ink tabular-nums">
        <span>{from}</span>
        <span className="text-rank-good">{to}</span>
      </Swap>
    </div>
  );
}
