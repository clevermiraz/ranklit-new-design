// BACKUP: the original v1 "sticker map" landing page, before its unslop pass. Live at /v1-sticker (not indexed).
// To restore it at /v1: cp src/app/v1-sticker/page.tsx src/app/v1/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Check, Clock, Eye, Mail, MapPin, MessageSquareReply, QrCode, Search, Sparkles, Star, Wallet, Zap } from "lucide-react";
import { ButtonLink, Container, Eyebrow, SectionHeading, Stars } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { RankScan } from "@/components/rank-scan";
// Hero visual. Backup: swap PhoneDevice for PhoneSim (the sticker phone in phone-sim.tsx) to revert.
import { PhoneDevice } from "@/components/phone-device";
import { RankLegend, type RankValue } from "@/components/rank-grid";
import { Faq } from "@/components/faq";
import { Logo, LogoMark } from "@/components/logo";
import { site, trialHref } from "@/lib/site";
import { MotionToggle } from "@/components/motion-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

// Illustrative 7×7 scans (49 points each). Labelled as samples wherever shown.
const FIRST_SCAN: RankValue[][] = [
  [null, null, 18, 16, null, null, null],
  [null, 17, 12, 11, 14, null, null],
  [19, 13, 8, 6, 9, 15, null],
  [16, 11, 6, 4, 7, 12, 18],
  [null, 14, 9, 7, 10, 16, null],
  [null, null, 15, 12, 17, null, null],
  [null, null, null, 19, null, null, null],
];

const LATEST_SCAN: RankValue[][] = [
  [14, 9, 7, 6, 8, 12, null],
  [9, 5, 4, 3, 4, 7, 15],
  [7, 3, 2, 1, 2, 4, 9],
  [6, 3, 1, 1, 1, 3, 8],
  [8, 4, 2, 1, 2, 5, 11],
  [12, 7, 4, 3, 5, 8, 16],
  [null, 13, 9, 8, 10, 17, null],
];

const INDUSTRIES = ["Plumbers", "HVAC", "Dentists", "Roofers", "Electricians", "Landscapers", "Auto repair", "Chiropractors", "Law firms", "Salons", "Cleaners", "Vets"];
// Hero rotator: 6 words, first repeated so the loop is seamless (see @keyframes words).
const ROTATOR = ["plumbers", "dentists", "roofers", "salons", "HVAC pros", "vets"];

const FEED = [
  { icon: Star, tone: "bg-sun", title: "Replied to a new 5★ review", time: "Mon · 11:47" },
  { icon: Sparkles, tone: "bg-bubblegum", title: "Wrote and posted a Google update", time: "Wed · 9:05" },
  { icon: Search, tone: "bg-sky", title: "Added missing holiday hours", time: "Thu · 4:10" },
  { icon: Star, tone: "bg-sun", title: "Replied to a new 4★ review", time: "Thu · 6:22" },
  { icon: Mail, tone: "bg-mint", title: "Sent your weekly rank update", time: "Fri · 8:00" },
];

const PLANS = [
  {
    id: "foundation" as const,
    name: "Foundation",
    price: 99,
    blurb: "The weekly work, done for one location.",
    features: [
      "Google posts 3× a week, approve first if you like",
      "AI replies to your 4–5★ reviews (opt in)",
      "Weekly map check from 49 spots, 10 searches tracked",
      "Monthly profile checkup",
      "Review page and QR code",
      "Weekly rank email and a monthly report",
    ],
  },
  {
    id: "growth" as const,
    name: "Growth",
    price: 199,
    popular: true,
    blurb: "More searches, more reviews, AI search.",
    features: [
      "Everything in Foundation",
      "20 searches tracked",
      "Review request emails, 250 a month",
      "AI search check: does ChatGPT, Perplexity or Google AI name you?",
    ],
  },
];

const FAQS = [
  {
    q: "Will Ranklit get me to number one on Google Maps?",
    a: "Nobody can promise that, and we won’t. Google decides the ranking. We do the steady work Google rewards, every week, and show you the map scan so you can see whether it is moving.",
  },
  {
    q: "Does it post to my Google profile without asking me?",
    a: "Only if you want it to. You can approve every post before it goes out, or let it publish on its own. Switch any time.",
  },
  {
    q: "What about bad reviews?",
    a: "The AI only answers 4 and 5 star reviews, and only if you turn that on. Reviews of 1 to 3 stars are left for you, because they need a human answer.",
  },
  {
    q: "What do you need from me to start?",
    a: "Sign in with the Google account that manages your Business Profile and approve access. Then check the searches we suggest (like “plumber near me”) and pick what you want it to do. About five minutes.",
  },
  {
    q: "How do the trial and billing work?",
    a: "You get 3 days free. After that it is $99 or $199 a month per location. No contract. Cancel from your billing page in one click.",
  },
  {
    q: "I have more than one location.",
    a: "Each location is priced on its own, so you can add them one at a time and put each one on the plan it needs.",
  },
];

/** Stagger index for [data-item] children (70ms per step, see globals.css). */
const i = (n: number) => ({ "--i": n }) as CSSProperties;
/** Load-time entrance delay for hero elements. */
const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

export const metadata: Metadata = { title: "Design v1 sticker (backup)", robots: { index: false, follow: false } };

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full border-2 border-ink bg-lime px-4 py-2 font-bold shadow-pop focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
        <Hero />
        <Ticker />
        <Problem />
        <Features />
        <MapCheck />
        <Feed />
        <HowItWorks />
        <Pricing />
        <section id="faq" className="scroll-mt-24 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <SectionHeading eyebrow="FAQ" title="Fair" highlight="questions." marker="var(--color-bubblegum)" />
            <Faq items={FAQS} />
          </div>
        </section>
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full border-2 border-ink bg-paper/90 pr-2.5 pl-5 shadow-pop backdrop-blur-xl dark:bg-[#111113]/80">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {[
            ["How it works", "#how"],
            ["Features", "#features"],
            ["Pricing", "#pricing"],
            ["FAQ", "#faq"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-semibold text-ink-2 transition-[color,background-color] duration-150 hover:bg-sun hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden min-h-11 items-center rounded-full px-3.5 text-sm font-semibold text-ink-2 transition-colors duration-150 hover:text-ink sm:inline-flex">
            Log in
          </Link>
          <ButtonLink href={trialHref()} size="sm" variant="lime">
            Start free trial
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" aria-hidden />
      {/* Dark mode only: the light source behind the phone (lime + purple glow). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block">
        <div className="absolute top-[74%] left-1/2 size-[620px] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgb(198_244_50/0.26),transparent_62%)] lg:top-[52%] lg:left-[73%]" />
        <div className="absolute top-[62%] left-[28%] size-[480px] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgb(155_71_204/0.3),transparent_62%)] lg:top-[30%] lg:left-[60%]" />
      </div>

      {/* Floating decorations. Pure garnish, hidden from AT. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <span className="animate-bob absolute top-36 left-[3%] grid size-14 place-items-center rounded-2xl border-2 border-ink bg-sun shadow-pop" style={{ "--r": "-8deg" } as CSSProperties}>
          <Star className="size-7 fill-ink" />
        </span>
        <span className="animate-bob absolute bottom-24 left-[44%] grid size-12 place-items-center rounded-full border-2 border-ink bg-bubblegum shadow-pop" style={{ "--r": "10deg", animationDelay: "-1.5s" } as CSSProperties}>
          <Zap className="size-6 fill-ink" />
        </span>
      </div>

      <Container className="relative grid grid-cols-1 items-center gap-16 pt-36 pb-20 sm:pt-44 lg:grid-cols-[1.1fr_1fr] lg:pb-28">
        <div>
          <div className="animate-rise" style={rise(60)}>
            <Eyebrow>
              <MapPin className="size-3.5 text-brand-600" strokeWidth={3} aria-hidden /> AI agent for Google Maps
            </Eyebrow>
          </div>
          <h1 className="tracking-display mt-7 text-[50px] leading-[0.95] sm:text-7xl lg:text-[84px]">
            <span className="animate-rise block" style={rise(120)}>
              Be the pin
            </span>
            <span className="animate-rise block" style={rise(200)}>
              people{" "}
              <span className="relative inline-block text-brand-600 dark:text-brand-400">
                pick.
                <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-[0.22em] w-full overflow-visible" aria-hidden>
                  <path d="M3 12 Q 25 3 50 11 T 100 11 T 150 11 T 197 9" fill="none" stroke="var(--color-tangerine)" strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="animate-draw" />
                </svg>
              </span>
            </span>
          </h1>

          <p className="animate-rise mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-2xl font-bold sm:text-3xl" style={rise(280)}>
            <span className="whitespace-nowrap">Made for busy</span>
            <span className="relative inline-block h-[1.25em] overflow-hidden rounded-lg border-2 border-ink bg-lime px-2 align-bottom leading-[1.25em] shadow-pop-sm">
              <span className="sr-only">local businesses</span>
              <span className="animate-words block" aria-hidden>
                {[...ROTATOR, ROTATOR[0]].map((w, n) => (
                  <span key={n} className="block h-[1.25em] whitespace-nowrap">
                    {w}
                  </span>
                ))}
              </span>
            </span>
          </p>

          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-ink-2" style={rise(340)}>
            Ranklit posts updates, answers your good reviews and fixes what is missing on your Google profile. Then it scans 49
            spots around you, so you <strong className="font-bold text-ink">see where you rank, not a guess.</strong>
          </p>
          <div className="animate-rise mt-9 flex flex-col gap-4 sm:flex-row" style={rise(400)}>
            <ButtonLink href={trialHref()} size="lg" arrow>
              Start your 3-day free trial
            </ButtonLink>
            <ButtonLink href="#how" variant="light" size="lg">
              See how it works
            </ButtonLink>
          </div>
          <p className="animate-rise mt-6 text-sm font-medium text-ink-2" style={rise(460)}>
            From $99/mo per location · No contract · Cancel in one click
          </p>
        </div>

        <div className="animate-rise relative mx-auto w-full max-w-[420px] pt-6 lg:mr-0" style={rise(260)}>
          <PhoneDevice />
          <span aria-hidden className="animate-bob absolute -right-2 bottom-14 hidden sm:block" style={{ "--r": "8deg", animationDelay: "-2s" } as CSSProperties}>
            <LogoMark className="size-16 drop-shadow-[3px_3px_0_var(--color-ink)]" />
          </span>
        </div>
      </Container>
    </section>
  );
}

function Ticker() {
  return (
    <div className="relative z-10 -my-2 -rotate-2 border-y-2 border-ink bg-night py-4 text-lime">
      <MotionToggle />
      <p className="sr-only">Built for local service businesses such as {INDUSTRIES.join(", ")}.</p>
      <div className="overflow-hidden" aria-hidden>
        <ul className="animate-marquee flex w-max gap-8 pr-8 hover:[animation-play-state:paused]">
          {[...INDUSTRIES, ...INDUSTRIES].map((x, n) => (
            <li key={n} className="flex items-center gap-8 font-display text-2xl font-extrabold whitespace-nowrap uppercase sm:text-3xl">
              {x} <Star className="size-5 fill-current" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Problem() {
  const items = [
    { icon: Wallet, bg: "bg-sun", tilt: "-rotate-2", title: "Agencies cost a lot", text: "Local SEO agencies often charge $1,500 or more a month, and send a report once a month that is hard to check." },
    { icon: Clock, bg: "bg-bubblegum", tilt: "rotate-1 md:translate-y-6", title: "DIY never gets done", text: "Posting every week, answering every review, keeping hours and photos right. It is the first thing to slip." },
    { icon: Eye, bg: "bg-sky", tilt: "-rotate-1", title: "You can’t see your rank", text: "Search from your own phone and you see one spot. Customers across town see something else." },
  ];
  return (
    <section className="py-28 sm:py-36">
      <Container>
        <SectionHeading eyebrow="The problem" title="Local SEO is simple work." highlight="It just never stops." />
        <Reveal stagger className="mt-16 grid gap-8 md:grid-cols-3">
          {items.map((it, n) => (
            <div key={it.title} data-item="" style={i(n * 2)}>
              <div className={`tint ${it.bg} ${it.tilt} relative h-full rounded-3xl border-2 border-ink p-7 shadow-pop transition-transform duration-300 ease-[var(--ease-spring)] hover:rotate-0 hover:-translate-y-2`}>
                {/* tape strip */}
                <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-3 rounded-sm border-2 border-ink/20 bg-white/70" aria-hidden />
                <span className="grid size-12 place-items-center rounded-2xl border-2 border-ink bg-white">
                  <it.icon className="size-6" strokeWidth={2.25} aria-hidden />
                </span>
                <h3 className="mt-5 text-2xl tracking-tight">{it.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/75">{it.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-24 border-y-2 border-ink bg-paper-2 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="What it does"
          title="The weekly work."
          highlight="Done, and shown to you."
          marker="var(--color-lime)"
          intro="Everything Google rewards, handled every week. Every action lands in your feed."
        />
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Tile className="lg:col-span-2" bg="bg-lime" title="Posts, three times a week." text="Fresh updates written for your business. Approve each one, or let them go out on their own.">
            <ul className="space-y-2.5">
              {[
                ["Mon", "Spring tune-up special", "Posted", "bg-mint", "bg-bubblegum"],
                ["Wed", "Meet our new technician", "Posted", "bg-mint", "bg-sky"],
                ["Fri", "Why filters matter in May", "Needs your OK", "bg-sun", "bg-tangerine"],
              ].map(([day, title, status, tone, img], n) => (
                <li key={day} data-item="" style={i(n + 1)} className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-white p-2 pr-3 sm:gap-3 sm:p-2.5 sm:pr-4">
                  <span className={`size-9 shrink-0 rounded-xl sm:size-11 border-2 border-ink ${img}`} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold">{title}</span>
                    <span className="block truncate text-xs whitespace-nowrap text-ink-2">{day} · 9:00 AM</span>
                  </span>
                  <span className={`shrink-0 rounded-full border-2 border-ink px-2 py-0.5 text-[11px] font-bold whitespace-nowrap sm:px-2.5 sm:text-xs ${tone}`}>{status}</span>
                </li>
              ))}
            </ul>
          </Tile>

          <Tile offset={2} bg="bg-bubblegum" title="Replies to your best reviews." text="Warm replies to 4–5★ reviews. The hard ones stay with you.">
            <div className="space-y-2.5">
              <div data-item="" style={i(1)} className="max-w-[88%] rounded-2xl rounded-bl-sm border-2 border-ink bg-white p-3.5">
                <Stars className="size-3.5" />
                <p className="mt-1.5 text-sm">Fast, friendly, fixed our AC the same day.</p>
              </div>
              {/* Pops from its own corner: the reply comes from your side of the thread. */}
              <div data-item="" data-pop="" style={i(4)} className="ml-auto max-w-[88%] origin-bottom-right rounded-2xl rounded-br-sm border-2 border-ink bg-brand-600 p-3.5 text-white shadow-pop-sm">
                <p className="flex items-center gap-1 text-[11px] font-bold text-white">
                  <MessageSquareReply className="size-3" aria-hidden /> Drafted by Ranklit
                </p>
                <p className="mt-1 text-sm">Thank you, Maria! Glad we got you cool again before the weekend.</p>
              </div>
            </div>
          </Tile>

          <Tile bg="bg-sky" title="A monthly checkup." text="Hours, photos, services and categories. It finds what is wrong and fixes what it can.">
            <ul className="space-y-2">
              {["Hours", "Photos", "Services", "Categories"].map((k, n) => (
                <li key={k} data-item="" style={i(n + 1)} className="flex items-center justify-between rounded-xl border-2 border-ink bg-white px-3.5 py-2 text-sm font-bold">
                  {k}
                  <span className="grid size-6 place-items-center rounded-full border-2 border-ink bg-lime">
                    <Check className="size-3.5" strokeWidth={3.5} aria-hidden />
                  </span>
                </li>
              ))}
            </ul>
          </Tile>

          <Tile offset={1} bg="bg-sun" title="More reviews, from your counter." text="Your own review page and a QR code for the counter, the van or the receipt.">
            <div className="flex items-center justify-center gap-3">
              <div data-item="" data-pop="" style={i(1)} className="grid size-24 shrink-0 -rotate-6 place-items-center rounded-2xl border-2 border-ink bg-white shadow-pop-sm">
                <QrCode className="size-14" strokeWidth={1.5} aria-hidden />
              </div>
              <div data-item="" data-pop="" style={i(2)} className="w-36 rotate-3 rounded-2xl border-2 border-ink bg-white p-4 text-center shadow-pop-sm">
                <LogoMark className="mx-auto size-6" />
                <p className="mt-1.5 text-xs font-bold">How did we do?</p>
                <div className="mt-1.5 flex justify-center">
                  <Stars className="size-3.5" />
                </div>
              </div>
            </div>
          </Tile>

          <Tile offset={2} bg="bg-mint" title="Your rank, every Monday." text="A short email: where you moved, and what the agent did last week.">
            <div data-item="" style={i(1)} className="rounded-2xl border-2 border-ink bg-white p-4">
              <p className="flex items-center gap-2 text-xs text-ink-2">
                <Mail className="size-3.5" aria-hidden /> Ranklit · Monday 8:00
              </p>
              <p className="mt-2 text-sm font-extrabold">You moved up in 22 of 49 spots</p>
              <div className="mt-3 flex h-3 overflow-hidden rounded-full border-2 border-ink">
                <span className="w-[29%] bg-rank-good" />
                <span className="w-[45%] bg-rank-mid" />
                <span className="flex-1 bg-rank-bad" />
              </div>
              <p className="mt-2 text-[11px] text-ink-2">Sample email</p>
            </div>
          </Tile>
        </div>
      </Container>
    </section>
  );
}

function Tile({
  title,
  text,
  bg,
  className,
  offset = 0,
  children,
}: {
  title: string;
  text: string;
  bg: string;
  className?: string;
  offset?: number;
  children: React.ReactNode;
}) {
  return (
    // Wrapper handles the reveal; the card handles hover, so the two transitions never fight.
    <Reveal className={className} style={{ "--o": offset } as CSSProperties}>
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-pop transition-[translate,box-shadow] duration-200 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-pop-lg">
        <div className={`tint grid min-h-[230px] grid-cols-[minmax(0,1fr)] items-center border-b-2 border-ink p-6 sm:p-8 ${bg}`}>{children}</div>
        <div className="p-7">
          <h3 className="text-2xl tracking-tight">{title}</h3>
          <p className="mt-2 leading-relaxed text-ink-2">{text}</p>
        </div>
      </article>
    </Reveal>
  );
}

function MapCheck() {
  const steps = [
    { bg: "bg-sky", title: "Each dot is a spot near you", text: "We search like a customer standing there. The ringed dot in the middle is your business." },
    { bg: "bg-sun", title: "The number is your place in the list", text: "1 means you came up first for that search." },
    { bg: "bg-mint", title: "Green means top 3", text: "That's where most of the calls go. Watch the green spread week by week." },
  ];
  return (
    <section id="map-check" className="scroll-mt-24 py-24 sm:py-32">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <Reveal>
          <Eyebrow>Your weekly map check</Eyebrow>
          <h2 className="tracking-display mt-6 text-4xl leading-[1.02] sm:text-5xl">
            Customers search from all over town.{" "}
            <span className="marker" style={{ "--marker": "var(--color-sky)" } as CSSProperties}>
              We check from 49 spots.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-2">
            Your phone shows you one list. A customer two miles away sees a different one. So every week we search from 49
            spots around your business and put every result on one map.
          </p>
          <ol className="mt-8 space-y-4">
            {steps.map((s, n) => (
              <li key={s.title} className="flex gap-4">
                <span className={`grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-lg font-extrabold shadow-pop-sm ${s.bg}`}>
                  {n + 1}
                </span>
                <span>
                  <span className="block text-lg font-bold">{s.title}</span>
                  <span className="block text-ink-2">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <RankLegend className="mt-8 flex flex-wrap gap-x-6 gap-y-2 space-y-0 text-sm" />
        </Reveal>
        <div className="mx-auto w-full max-w-[480px] lg:mr-0">
          <div className="-rotate-1 transition-transform duration-500 ease-[var(--ease-spring)] hover:rotate-0">
            <RankScan before={FIRST_SCAN} after={LATEST_SCAN} keyword="plumber near me" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Feed() {
  return (
    <section className="relative overflow-hidden bg-night py-24 text-white sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1.2px,transparent_1.2px)] [background-size:24px_24px]" aria-hidden />
      <Container className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <Eyebrow className="bg-lime">Activity feed</Eyebrow>
          <h2 className="tracking-display mt-6 text-4xl leading-[1.02] text-white sm:text-6xl">
            You always know{" "}
            <span className="marker marker-full text-ink" style={{ "--marker": "var(--color-lime)" } as CSSProperties}>
              what it did.
            </span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
            Every post, reply, fix and scan lands in your feed, and a summary hits your inbox each week. Nothing happens behind
            your back.
          </p>
        </Reveal>
        <div className="rotate-1 rounded-[28px] border-2 border-white bg-paper p-2 text-ink shadow-[8px_8px_0_var(--color-lime)] dark:border-white/15 dark:bg-[var(--s1)] dark:shadow-none">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="font-display text-lg font-extrabold">This week</span>
            <span className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-lime px-2.5 py-0.5 text-xs font-bold">
              <span className="size-2 animate-pulse rounded-full bg-rank-good" aria-hidden /> Running
            </span>
          </div>
          <Reveal as="ul" stagger className="space-y-2 px-1">
            {FEED.map((f, n) => (
              <li key={f.title + f.time} data-item="" style={i(n)} className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-white px-3 py-2.5">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl border-2 border-ink ${f.tone}`}>
                  <f.icon className="size-4.5" strokeWidth={2.25} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold">{f.title}</span>
                  <span className="block text-xs text-ink-2">{f.time}</span>
                </span>
                <span className="grid size-7 place-items-center rounded-full border-2 border-ink bg-mint">
                  <Check className="size-4" strokeWidth={3} aria-hidden />
                  <span className="sr-only">Done</span>
                </span>
              </li>
            ))}
          </Reveal>
          <p className="px-4 pt-3 pb-2 text-center text-[11px] font-bold tracking-[0.12em] text-ink-2 uppercase">Sample week</p>
        </div>
      </Container>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { bg: "bg-lime", title: "Connect Google", text: "Sign in with the account that runs your Business Profile. About a minute." },
    { bg: "bg-bubblegum", title: "Check your plan", text: "We suggest the searches to track and what to automate. Edit anything, turn off what you don’t want." },
    { bg: "bg-sky", title: "Watch it work", text: "Posts, replies and your first map scan start that week." },
  ];
  return (
    <section id="how" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="How it works" title="Five minutes to set up." highlight="Then it runs." marker="var(--color-sky)" />
        <Reveal as="ol" stagger className="relative mt-20 grid gap-14 md:grid-cols-3">
          {/* Dashed route between the stops; draws itself on reveal. */}
          <svg className="absolute top-6 right-[16%] left-[16%] hidden h-12 w-[68%] overflow-visible md:block" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden>
            <path d="M0 20 C 100 -10, 200 50, 300 20 S 500 -10, 600 20" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray="1" data-draw="" />
          </svg>
          {steps.map((s, n) => (
            <li key={s.title} data-item="" style={i(n * 3)} className="relative text-center">
              <span className={`hover-wiggle mx-auto grid size-20 place-items-center rounded-full border-2 border-ink font-display text-4xl font-extrabold shadow-pop ${s.bg} ${n % 2 ? "rotate-6" : "-rotate-6"}`}>
                {n + 1}
              </span>
              <h3 className="mt-7 text-2xl tracking-tight">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-[270px] leading-relaxed text-ink-2">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function SpinBadge() {
  return (
    <span className="absolute -top-10 -right-2 grid size-28 sm:-right-6 place-items-center" aria-hidden>
      <span className="absolute inset-0 rounded-full border-2 border-ink bg-sun shadow-pop" />
      <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 size-full">
        <defs>
          <path id="badge-circle" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
        </defs>
        <text className="fill-ink font-display text-[10px] font-extrabold tracking-[0.1em] uppercase">
          <textPath href="#badge-circle">Most popular ★ Most popular ★</textPath>
        </text>
      </svg>
      <Star className="relative size-7 fill-tangerine" strokeWidth={2} />
    </span>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-y-2 border-ink bg-paper-2 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Pricing" title="Two plans." highlight="Priced per location." marker="var(--color-bubblegum)" intro="3 days free. No contract. Cancel in one click." />
        <Reveal stagger className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
          {PLANS.map((p, n) => {
            const pop = p.popular;
            return (
              <div key={p.id} data-item="" style={i(n * 2)}>
                <div
                  className={`relative flex h-full flex-col rounded-[32px] border-2 border-ink p-8 transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-1.5 ${pop ? "tint bg-lime shadow-pop-lg md:rotate-1" : "bg-white shadow-pop md:-rotate-1"}`}
                >
                  {pop && <SpinBadge />}
                  {pop && <p className="sr-only">Most popular plan.</p>}
                  <h3 className="text-3xl tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-ink-2">{p.blurb}</p>
                  <p className="mt-7 flex items-baseline gap-1.5">
                    <span className="tracking-display font-display text-7xl font-extrabold tabular-nums">${p.price}</span>
                    <span className="font-medium text-ink-2">/mo per location</span>
                  </p>
                  <ul className="mt-8 mb-10 space-y-3 text-[15px]">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 border-ink ${pop ? "bg-white" : "bg-lime"}`}>
                          <Check className="size-3" strokeWidth={3.5} aria-hidden />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href={trialHref(p.id)} variant={pop ? "primary" : "light"} className="mt-auto w-full" arrow>
                    Start free trial
                  </ButtonLink>
                </div>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-3 pb-24 sm:px-6">
      <Reveal className="tint relative mx-auto max-w-6xl overflow-hidden rounded-[40px] border-2 border-ink bg-brand-600 px-6 py-20 text-center text-white shadow-pop-lg sm:px-12 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.14)_1.2px,transparent_1.2px)] [background-size:24px_24px]" aria-hidden />
        {/* Bobbing lit-r stickers: a tiny map of "you, showing up". */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[
            ["top-10 left-[8%]", "-10deg", "0s", "size-12"],
            ["bottom-12 left-[16%]", "8deg", "-1s", "size-9"],
            ["top-14 right-[10%]", "12deg", "-2s", "size-14"],
            ["bottom-10 right-[18%]", "-6deg", "-3s", "size-10"],
          ].map(([pos, r, d, size]) => (
            <span key={pos} className={`animate-bob absolute hidden sm:block ${pos}`} style={{ "--r": r, animationDelay: d } as CSSProperties}>
              <LogoMark className={`${size} drop-shadow-[3px_3px_0_var(--color-ink)]`} />
            </span>
          ))}
        </div>
        <div className="relative">
          <h2 className="tracking-display mx-auto max-w-3xl text-5xl leading-[0.98] text-white sm:text-7xl">
            Stop guessing where you rank.{" "}
            <span className="marker marker-full text-ink" style={{ "--marker": "var(--color-lime)" } as CSSProperties}>
              See it this week.
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-lg text-white">Connect Google and your first map scan runs the same day.</p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink href={trialHref()} variant="lime" size="lg" arrow>
              Start your 3-day free trial
            </ButtonLink>
            <ButtonLink href="#pricing" variant="light" size="lg">
              Compare plans
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper-2">
      <Container className="py-10 text-sm text-ink-2">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-x-6 font-semibold [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center [&>a]:px-1 lg:[&>a]:min-h-6" aria-label="Footer">
            <a href="#pricing" className="transition-colors duration-150 hover:text-ink">Pricing</a>
            <Link href="/privacy" className="transition-colors duration-150 hover:text-ink">Privacy</Link>
            <Link href="/terms" className="transition-colors duration-150 hover:text-ink">Terms</Link>
            <a href={`mailto:${site.email}`} className="transition-colors duration-150 hover:text-ink">{site.email}</a>
          </nav>
        </div>
        <p className="mt-8 border-t-2 border-dashed border-ink/15 pt-6 text-center text-xs leading-relaxed sm:text-left">
          © Ranklit. Rank maps, posts, reviews and the activity feed on this page are illustrative samples, not customer data.
          Google decides rankings; no one can guarantee a position.
        </p>
      </Container>
    </footer>
  );
}
