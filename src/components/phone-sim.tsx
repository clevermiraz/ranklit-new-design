"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { Car, House, MapPin, QrCode, Scissors, Search, Smile, Snowflake, Sparkles, Star, Trophy, Wrench, type LucideIcon } from "lucide-react";
import { MapBackdrop } from "@/components/rank-grid";

const ROW = 56; // px per result row; rows slide by whole rows
const TICK_MS = 1900;

// Made-up businesses per industry, never real ones. Each page load starts on a random industry and
// every replay moves to the next, so visitors see their own trade. Shared by both hero phones.
type Rival = { name: string; rating: string; reviews: number; mi: string };
export type Scenario = { query: string; category: string; icon: LucideIcon; rivals: Rival[] };
const r = (name: string, rating: string, reviews: number, mi: string): Rival => ({ name, rating, reviews, mi });
export const SCENARIOS: Scenario[] = [
  { query: "plumber near me", category: "Plumber", icon: Wrench, rivals: [r("Valley Pipe & Drain", "4.6", 212, "0.8"), r("Rapid Rooter Co.", "4.4", 96, "1.5"), r("Clearflow Plumbing", "4.5", 154, "2.1"), r("Hometown Plumbers", "4.2", 61, "1.1"), r("Main St. Plumbing", "4.3", 88, "2.6")] },
  { query: "dentist near me", category: "Dentist", icon: Smile, rivals: [r("Brightside Dental", "4.7", 318, "0.9"), r("Oak Family Dentistry", "4.5", 142, "1.4"), r("Smile Studio", "4.6", 205, "2.0"), r("Parkview Dental Care", "4.3", 77, "1.2"), r("Riverbend Dentists", "4.4", 98, "2.4")] },
  { query: "ac repair near me", category: "HVAC contractor", icon: Snowflake, rivals: [r("CoolBreeze Heating & Air", "4.6", 187, "1.0"), r("Comfort Pro HVAC", "4.4", 103, "1.7"), r("Arctic Air Services", "4.5", 129, "2.3"), r("Summit Climate Co.", "4.2", 58, "0.9"), r("All Seasons Air", "4.3", 84, "2.8")] },
  { query: "roofer near me", category: "Roofing contractor", icon: House, rivals: [r("Peak Roofing Co.", "4.7", 164, "1.3"), r("Shield Roof & Gutter", "4.5", 91, "2.2"), r("Top Line Roofers", "4.4", 120, "1.6"), r("Cedar Ridge Roofing", "4.3", 47, "3.0"), r("Ironclad Roofing", "4.2", 66, "2.5")] },
  { query: "hair salon near me", category: "Hair salon", icon: Scissors, rivals: [r("Velvet Hair Studio", "4.8", 402, "0.6"), r("The Cutting Room", "4.6", 233, "1.1"), r("Bloom Salon", "4.5", 178, "1.8"), r("Mane Street Hair", "4.4", 96, "0.9"), r("Luxe Locks", "4.3", 121, "2.2")] },
  { query: "auto repair near me", category: "Auto repair shop", icon: Car, rivals: [r("Precision Auto Care", "4.6", 276, "1.2"), r("Northside Garage", "4.4", 133, "0.8"), r("Torque Auto Repair", "4.5", 158, "2.0"), r("Mike's Motor Works", "4.3", 72, "1.6"), r("QuickFix Auto", "4.2", 95, "2.7")] },
];
// Picked once per page load in the browser; the server always renders the first so hydration matches.
const CLIENT_START = typeof window === "undefined" ? 0 : Math.floor(Math.random() * SCENARIOS.length);
const noSubscribe = () => () => {};

// Each beat: the work Ranklit did, then where you landed. `hold` = how many ticks to stay.
export const STEPS: { pos: number; reviews: number; icon: LucideIcon; did: string; hold?: number }[] = [
  { pos: 5, reviews: 118, icon: MapPin, did: "Ranklit connected to your Google profile" },
  { pos: 4, reviews: 121, icon: Sparkles, did: "Posted a Google update" },
  { pos: 3, reviews: 124, icon: Star, did: "Replied to a new 5★ review" },
  { pos: 2, reviews: 124, icon: Search, did: "Added your missing holiday hours" },
  { pos: 1, reviews: 129, icon: QrCode, did: "5 new reviews from your counter QR code" },
  { pos: 0, reviews: 133, icon: Trophy, did: "Top of the list for “%q”", hold: 3 },
];
const SEQ = STEPS.flatMap((s, i) => Array<number>(s.hold ?? 1).fill(i));

/** The climb: one beat per tick, only while `ref` is on screen and motion isn't paused. `run` bumps on each replay. */
export function useClimb(ref: React.RefObject<HTMLElement | null>) {
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    let k = 0;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const id = window.setInterval(() => {
      if (!visible || document.documentElement.dataset.motion === "paused") return;
      k = (k + 1) % SEQ.length;
      if (k === 0) setRun((r) => r + 1); // remount the list: a fresh start, not a drop in rank
      setStep(SEQ[k]);
    }, TICK_MS);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [ref]);

  const start = useSyncExternalStore(noSubscribe, () => CLIENT_START, () => 0);
  const sc = SCENARIOS[(start + run) % SCENARIOS.length]; // next industry on every replay
  const st = STEPS[step];
  const s = { ...st, did: st.did.replace("%q", sc.query) };
  const order = [...sc.rivals.slice(0, s.pos), null, ...sc.rivals.slice(s.pos)]; // null = you
  return { step, run, s, sc, order };
}

/**
 * Backup hero (sticker phone). Customer's-eye view: a phone search where "your business" climbs one row per beat while the
 * work that earned it pops up beside the phone. Plays only on screen and honours the page's motion
 * toggle; under reduced motion rows jump instead of sliding. Replays with a fade rather than a fall.
 */
export function PhoneSim() {
  const ref = useRef<HTMLDivElement>(null);
  const { step, run, s, sc, order } = useClimb(ref);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[340px]">
      <p className="sr-only">
        Sample animation: as Ranklit posts updates, replies to reviews and fixes your profile, your business moves up the
        local results for a search like “{sc.query}”.
      </p>

      <div aria-hidden className="relative">
        {/* The phone */}
        <div className="rotate-2 rounded-[46px] border-[3px] border-ink bg-night p-2 shadow-pop-lg transition-transform duration-500 ease-[var(--ease-spring)] hover:rotate-0">
          <div className="relative overflow-hidden rounded-[38px] bg-white">
            <div className="absolute top-2 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-night" />
            <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-bold">
              <span>9:41</span>
              <span className="flex gap-0.5">
                {[2, 3, 4].map((h) => (
                  <span key={h} className="w-1 rounded-sm bg-night" style={{ height: h * 2.5 }} />
                ))}
              </span>
            </div>

            <div className="px-3 pt-2">
              <div className="flex items-center gap-2 rounded-full border-2 border-ink bg-white px-3 py-2 text-sm font-semibold shadow-pop-sm">
                <Search className="size-4 shrink-0" strokeWidth={2.5} />
                {sc.query}
              </div>
            </div>

            {/* Mini map: you are the purple dot */}
            <div className="relative mx-3 mt-3 h-24 overflow-hidden rounded-2xl border-2 border-ink">
              <MapBackdrop />
              {[
                [18, 30],
                [62, 22],
                [80, 62],
                [34, 70],
                [50, 46],
              ].map(([x, y]) => (
                <span key={`${x}-${y}`} className="absolute size-3 rounded-full border-2 border-white bg-night" style={{ left: `${x}%`, top: `${y}%` }} />
              ))}
              <span className="absolute top-[52%] left-[66%] size-4 -translate-1/2 rounded-full border-2 border-ink bg-brand-600" />
              <span key={step} className="animate-ping-once absolute top-[52%] left-[66%] size-16 -translate-1/2 rounded-full border-2 border-brand-600 bg-brand-400/20" />
            </div>

            {/* Results */}
            <div key={run} className="animate-rise relative mx-1 mt-2 mb-3" style={{ height: ROW * order.length }}>
              {order.map((b, idx) => {
                const you = b === null;
                return (
                  <div
                    key={you ? "you" : b.name}
                    className={clsx(
                      "absolute inset-x-0 top-0 flex items-center gap-2.5 rounded-2xl px-3 transition-transform duration-700 ease-[var(--ease-spring)] motion-reduce:transition-none",
                      you ? "z-10 mx-0.5 border-2 border-ink bg-lime shadow-pop-sm" : "border-b border-ink/10",
                    )}
                    style={{ height: ROW - 4, transform: `translateY(${idx * ROW}px)` }}
                  >
                    <span className={clsx("w-5 text-center font-display text-sm font-extrabold tabular-nums", !you && "text-ink-2")}>{idx + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 truncate text-[13px] font-bold">
                        {you ? "Your business" : b.name}
                        {you && <span className="rounded-full bg-night px-1.5 py-px text-[9px] font-extrabold text-lime">YOU</span>}
                      </span>
                      <span className="block text-[11px] text-ink-2">
                        <span className="text-amber-500">★</span> {you ? "4.9" : b.rating} ({you ? s.reviews : b.reviews}) · {you ? "1.2" : b.mi} mi ·{" "}
                        <span className="font-semibold text-rank-good">Open</span>
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* What Ranklit just did */}
        <div key={`did-${run}-${step}`} className="animate-pop absolute -top-6 -left-4 z-30 max-w-[230px] sm:-left-24">
          <div className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-3 py-2 text-[13px] font-bold shadow-pop">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg border-2 border-ink bg-sun">
              <s.icon className="size-3.5" strokeWidth={2.5} />
            </span>
            {s.did}
          </div>
        </div>

        {/* Your rank */}
        <div className="absolute top-1/2 -left-6 z-30 -rotate-6 rounded-2xl border-2 border-ink bg-bubblegum px-3 py-2 text-center shadow-pop sm:-left-20">
          <p className="text-[11px] font-extrabold tracking-wide uppercase">Your rank</p>
          <p key={s.pos} className="animate-pop font-display text-4xl leading-none font-extrabold tabular-nums">#{s.pos + 1}</p>
        </div>
      </div>

      <p className="mt-6 text-center text-xs font-medium text-ink-2">Sample animation, not a promise. Google decides rankings.</p>
    </div>
  );
}
