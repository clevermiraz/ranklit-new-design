"use client";

import { useRef } from "react";
import clsx from "clsx";
import { ArrowLeft, Clock, Star } from "lucide-react";
import { useClimb } from "@/components/phone-sim";

const ROW = 70; // result row height (px)
const SHEET_TOP = 300; // where the results sheet starts on the 640px-tall screen
const SYS_FONT = { fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" };

// Rival pins on the 310×640 screen (x, y); you sit at YOU_PIN.
const PINS: [number, number][] = [
  [62, 182],
  [236, 160],
  [118, 252],
  [262, 238],
  [40, 268],
];
const YOU_PIN: [number, number] = [184, 214];

/**
 * Hero: a realistic iPhone running a maps-style search. "Your business" starts buried below the
 * sheet, climbs into view and up the list while the work that earned it pops up beside the phone.
 * Shares its timeline with the backup sticker phone (useClimb in phone-sim.tsx).
 */
export function PhoneDevice() {
  const ref = useRef<HTMLDivElement>(null);
  const { step, run, s, sc, order } = useClimb(ref);
  const top3 = s.pos <= 2;

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[330px]">
      <p className="sr-only">
        Sample animation: a customer searches “{sc.query}” on their phone. As Ranklit posts updates, replies to
        reviews and fixes your profile, your business moves up the results until it is first.
      </p>

      <div aria-hidden className="relative">
        {/* Titanium frame */}
        <div className="relative rotate-2 rounded-[54px] bg-[linear-gradient(145deg,#4a4a51,#1d1d21_38%,#33333a_62%,#141417)] p-[11px] shadow-[0_0_0_1px_#6b6b73_inset,0_44px_80px_-32px_rgb(0_0_0/0.6),0_18px_36px_-18px_rgb(0_0_0/0.45)] transition-transform duration-500 ease-[var(--ease-spring)] hover:rotate-0">
          {/* side buttons */}
          <span className="absolute top-[118px] -left-[3px] h-7 w-[4px] rounded-l-sm bg-[#2c2c31]" />
          <span className="absolute top-[166px] -left-[3px] h-12 w-[4px] rounded-l-sm bg-[#2c2c31]" />
          <span className="absolute top-[226px] -left-[3px] h-12 w-[4px] rounded-l-sm bg-[#2c2c31]" />
          <span className="absolute top-[184px] -right-[3px] h-20 w-[4px] rounded-r-sm bg-[#2c2c31]" />

          {/* Screen */}
          <div className="maps relative h-[640px] overflow-hidden rounded-[43px] bg-[var(--m-land)] ring-[5px] ring-black" style={SYS_FONT}>
            <MapLayer />

            {/* rival pins */}
            {PINS.map(([x, y]) => (
              <Pin key={`${x}-${y}`} x={x} y={y} />
            ))}
            {/* searcher's location */}
            <span className="absolute size-[18px] -translate-1/2 rounded-full border-[3px] border-white bg-[#4285f4] shadow-[0_0_0_10px_rgb(66_133_244/0.18)]" style={{ left: 150, top: 120 }} />

            {/* your pin: grows and gets a label as you climb */}
            <div className="absolute z-10" style={{ left: YOU_PIN[0], top: YOU_PIN[1] }}>
              <span key={step} className="animate-ping-once absolute top-0 left-0 size-20 -translate-1/2 rounded-full bg-[#9b47cc]/25" />
              <div className="transition-transform duration-700 ease-[var(--ease-spring)] motion-reduce:transition-none" style={{ transform: `scale(${1 + (5 - s.pos) * 0.09})`, transformOrigin: "50% 0" }}>
                <Pin x={0} y={0} you />
              </div>
              <span
                className={clsx(
                  "absolute top-1 left-5 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-[var(--m-text)] shadow-[0_1px_3px_rgb(60_64_67/0.35)] transition-opacity duration-500",
                  top3 ? "opacity-100" : "opacity-0",
                )}
              >
                Your business <span className="text-[#e37400]">★</span> 4.9
              </span>
            </div>

            {/* Dynamic Island + status bar */}
            <span className="absolute top-[11px] left-1/2 z-30 h-[30px] w-[100px] -translate-x-1/2 rounded-full bg-black" />
            <div className="absolute inset-x-0 top-0 z-20 flex h-[52px] items-center justify-between px-8 pt-1 text-[14px] font-semibold text-[var(--m-status)]">
              <span>9:41</span>
              <StatusIcons />
            </div>

            {/* Search box + chips */}
            <div className="absolute inset-x-3 top-[54px] z-20">
              <div className="flex h-12 items-center gap-3 rounded-full bg-white px-4 text-[15px] text-[var(--m-text)] shadow-[0_1px_3px_rgb(60_64_67/0.3),0_4px_8px_rgb(60_64_67/0.15)]">
                <ArrowLeft className="size-5 text-[var(--m-sub)]" strokeWidth={2} />
                <span key={sc.query} className="animate-rise flex-1 truncate">{sc.query}</span>
                <span className="grid size-8 place-items-center rounded-full bg-[#9b47cc] text-[13px] font-semibold text-white">Y</span>
              </div>
              <div className="mt-2 flex gap-2 overflow-hidden">
                {["Open now", "Top rated", "Hours", "Price"].map((c, n) => (
                  <span key={c} className="flex h-8 shrink-0 items-center gap-1 rounded-full border border-[var(--m-line)] bg-white px-3 text-[13px] text-[var(--m-text)] shadow-[0_1px_2px_rgb(60_64_67/0.15)]">
                    {n === 2 && <Clock className="size-3.5" />}
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Results sheet */}
            <div className="absolute inset-x-0 bottom-0 z-20 rounded-t-[18px] bg-white shadow-[0_-2px_10px_rgb(60_64_67/0.18)]" style={{ top: SHEET_TOP }}>
              <span className="mx-auto mt-2 block h-1 w-9 rounded-full bg-[var(--m-line)]" />
              <div key={run} className="animate-rise relative mt-2 overflow-hidden" style={{ height: 640 - SHEET_TOP - 14 }}>
                {order.map((b, idx) => {
                  const you = b === null;
                  return (
                    <div
                      key={you ? "you" : b.name}
                      className={clsx(
                        "absolute inset-x-0 top-0 flex items-center gap-3 border-b border-[var(--m-line)] px-4 transition-transform duration-700 ease-[var(--ease-spring)] motion-reduce:transition-none",
                        you ? "z-10 border-l-4 border-l-[#9b47cc] bg-[var(--m-you)]" : "bg-white",
                      )}
                      style={{ height: ROW, transform: `translateY(${idx * ROW}px)` }}
                    >
                      <div className="min-w-0 flex-1 leading-tight">
                        <p className="flex items-center gap-1.5 truncate text-[15px] font-medium text-[var(--m-text)]">
                          {you ? "Your business" : b.name}
                          {you && <span className="rounded bg-[#9b47cc] px-1 text-[9px] font-bold text-white">YOU</span>}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-[var(--m-sub)]">
                          <span className="text-[var(--m-text)]">{you ? "4.9" : b.rating}</span>
                          <Stars />
                          <span className="tabular-nums">({you ? s.reviews : b.reviews})</span>
                        </p>
                        <p className="mt-0.5 truncate text-[12.5px] text-[var(--m-sub)]">
                          {sc.category} · {you ? "1.2" : b.mi} mi · <span className="text-[var(--m-open)]">Open</span>
                        </p>
                      </div>
                      <span className="grid size-[52px] shrink-0 place-items-center rounded-lg [background:var(--m-thumb)]">
                        <sc.icon className="size-5 text-[var(--m-sub)]" />
                      </span>
                    </div>
                  );
                })}
              </div>
              <span className="absolute bottom-2 left-1/2 z-30 h-[5px] w-[120px] -translate-x-1/2 rounded-full bg-black/80" />
            </div>

            {/* glass glare */}
            <span className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(118deg,rgb(255_255_255/0.16),transparent_32%)]" />
          </div>
        </div>

        {/* What Ranklit just did */}
        <div key={`did-${run}-${step}`} className="animate-pop absolute -top-8 -left-4 z-30 max-w-[230px] sm:-left-24">
          <div className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-3 py-2 text-[13px] font-bold shadow-pop">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg border-2 border-ink bg-sun">
              <s.icon className="size-3.5" strokeWidth={2.5} />
            </span>
            {s.did}
          </div>
        </div>

        {/* Your rank */}
        <div className="absolute top-[25%] -left-1 z-30 -rotate-6 rounded-2xl border-2 border-ink bg-bubblegum px-3 py-2 text-center shadow-pop sm:-left-32">
          <p className="text-[11px] font-extrabold tracking-wide uppercase">Your rank</p>
          <p key={s.pos} className="animate-pop font-display text-4xl leading-none font-extrabold tabular-nums">#{s.pos + 1}</p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs font-medium text-ink-2">Sample animation, not a promise. Google decides rankings.</p>
    </div>
  );
}

/** Teardrop map pin, tip at (x, y). Rivals are red; you are the brand purple. */
function Pin({ x, y, you }: { x: number; y: number; you?: boolean }) {
  return (
    <svg viewBox="0 0 24 34" className="absolute h-[34px] w-6 -translate-x-1/2 -translate-y-full drop-shadow-[0_2px_2px_rgb(0_0_0/0.3)]" style={{ left: x, top: y }}>
      <path d="M12 0C5.4 0 0 5.2 0 11.6 0 20.3 12 34 12 34s12-13.7 12-22.4C24 5.2 18.6 0 12 0z" fill={you ? "#9b47cc" : "#ea4335"} stroke={you ? "#6f2d99" : "#b31412"} strokeWidth="1" />
      <circle cx="12" cy="12" r="4.5" fill={you ? "#fff" : "#b31412"} />
    </svg>
  );
}

function Stars() {
  return (
    <span className="flex">
      {Array.from({ length: 5 }).map((_, n) => (
        <Star key={n} className="size-[11px] fill-[#fbbc04] text-[#fbbc04]" strokeWidth={0} />
      ))}
    </span>
  );
}

function StatusIcons() {
  return (
    <span className="flex items-center gap-1.5">
      <svg viewBox="0 0 18 12" className="h-3 w-[18px]" style={{ fill: "var(--m-status)" }}>
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg viewBox="0 0 16 12" className="h-3 w-4" style={{ fill: "var(--m-status)" }}>
        <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.3-1.3A10.3 10.3 0 0 0 8 .4 10.3 10.3 0 0 0 .7 3.3L2 4.6a8.5 8.5 0 0 1 6-2.4zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.3-1.3A6.6 6.6 0 0 0 8 4a6.6 6.6 0 0 0-4.7 1.8l1.3 1.3c.9-.8 2.1-1.3 3.4-1.3zM8 9.4 6 11.4l2 .6 2-.6-2-2z" />
      </svg>
      <span className="relative h-3 w-6 rounded-[4px] border border-[var(--m-sub)] p-[1.5px]">
        <span className="block h-full w-[78%] rounded-[2px] bg-[var(--m-status)]" />
      </span>
    </span>
  );
}

/** Street map in a familiar maps-app palette: grey land, white streets, yellow arterials, park, water. */
function MapLayer() {
  const streets = [
    "M-10 70 L320 96",
    "M-10 196 L320 214",
    "M-10 300 L320 318",
    "M48 -10 L70 360",
    "M150 -10 L166 360",
    "M262 -10 L250 360",
  ];
  return (
    <svg viewBox="0 0 310 360" className="absolute inset-x-0 top-0 h-[360px] w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="310" height="360" style={{ fill: "var(--m-land)" }} />
      {/* blocks */}
      {[
        [6, 8, 36, 52],
        [78, 12, 64, 64],
        [174, 20, 70, 62],
        [76, 112, 66, 72],
        [174, 128, 66, 66],
        [8, 220, 46, 66],
        [180, 226, 62, 64],
      ].map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="3" style={{ fill: "var(--m-block)" }} />
      ))}
      <path d="M70 216 L150 224 L148 296 L72 290 Z" style={{ fill: "var(--m-park)" }} />
      <path d="M262 -10 C 240 60, 300 120, 330 150 L330 -10 Z" style={{ fill: "var(--m-water)" }} />
      {streets.map((d) => (
        <path key={`c${d}`} d={d} style={{ stroke: "var(--m-casing)" }} strokeWidth="11" fill="none" />
      ))}
      {streets.map((d) => (
        <path key={d} d={d} style={{ stroke: "var(--m-road)" }} strokeWidth="8" fill="none" />
      ))}
      <path d="M-10 150 C 90 140, 200 170, 320 130" style={{ stroke: "var(--m-artc)" }} strokeWidth="12" fill="none" />
      <path d="M-10 150 C 90 140, 200 170, 320 130" style={{ stroke: "var(--m-art)" }} strokeWidth="9" fill="none" />
      <text x="8" y="146" fontSize="8" style={{ fill: "var(--m-label)" }} fontFamily="system-ui, sans-serif">
        Main St
      </text>
      <text x="96" y="262" fontSize="8" style={{ fill: "var(--m-park-label)" }} fontFamily="system-ui, sans-serif">
        Riverside Park
      </text>
      <text x="200" y="208" fontSize="7.5" style={{ fill: "var(--m-label)" }} fontFamily="system-ui, sans-serif">
        Oak Ave
      </text>
    </svg>
  );
}
