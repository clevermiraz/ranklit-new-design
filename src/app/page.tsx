// v2 "clean SaaS" landing page. Backup of the previous design: src/app/v1/page.tsx (live at /v1, not indexed).
// Trust proof (testimonials, stats, guarantee, founder, company) comes from src/content/proof.ts and stays hidden until filled.
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import {
  ArrowRight,
  BellRing,
  Check,
  CircleCheck,
  ClipboardCheck,
  Clock,
  Eye,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  MessageSquareReply,
  Newspaper,
  QrCode,
  Search,
  ShieldCheck,
  Star,
  ThumbsUp,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { gridStats, rankTone, type RankValue } from "@/components/rank-grid";
import { RankMap } from "@/components/v2/rank-map";
import { DOT_BG } from "@/components/v2/dot-tone";
import { site, trialHref } from "@/lib/site";
import { company, founder, guarantee, stats, testimonials } from "@/content/proof";

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

const INDUSTRIES = ["plumbers", "HVAC", "dentists", "roofers", "electricians", "landscapers", "auto repair", "chiropractors", "salons", "cleaners", "vets"];

const FEED = [
  { icon: Star, title: "Replied to a new 5★ review", time: "Mon 11:47" },
  { icon: Newspaper, title: "Posted “Spring tune-up special”", time: "Wed 9:05" },
  { icon: Clock, title: "Added missing holiday hours", time: "Thu 16:10" },
  { icon: Star, title: "Replied to a new 4★ review", time: "Thu 18:22" },
  { icon: Mail, title: "Sent your weekly rank update", time: "Fri 8:00" },
];

const FEATURES = [
  { icon: Newspaper, title: "Google posts, 3× a week", text: "Updates written for your business. Approve each one first, or let them publish on their own." },
  { icon: MessageSquareReply, title: "Replies to good reviews", text: "Warm, personal replies to 4–5★ reviews, if you turn it on. 1–3★ reviews stay with you." },
  { icon: ClipboardCheck, title: "Monthly profile checkup", text: "Hours, photos, services and categories are checked, and fixed where they can be." },
  { icon: QrCode, title: "Review page and QR code", text: "Your own review link and a printable QR code for the counter, the van or the receipt." },
  { icon: MapPin, title: "Weekly map scan", text: "Your position from 49 spots around you, for every search you track." },
  { icon: Mail, title: "A plain-English report", text: "A short email every Monday and a monthly report: where you moved and what was done." },
];

const CONTROL = [
  { icon: KeyRound, title: "You sign in with Google", text: "You connect through Google’s own sign-in screen. We never see your Google password." },
  { icon: Eye, title: "Approve before it posts", text: "Turn on approvals and nothing goes live on your profile until you say so." },
  { icon: ThumbsUp, title: "Hard reviews stay human", text: "Automatic replies are opt-in and only for 4–5★ reviews. Anything lower is yours to answer." },
  { icon: LogOut, title: "Leave any time", text: "No contract. Cancel in one click, and remove Ranklit’s access from your Google account whenever you like." },
];

const PLANS = [
  {
    id: "foundation" as const,
    name: "Foundation",
    price: 99,
    blurb: "The weekly work, done for one location.",
    features: [
      "Google posts 3× a week, approve first if you like",
      "Replies to your 4–5★ reviews (opt in)",
      "Weekly map scan from 49 spots, 10 searches tracked",
      "Monthly profile checkup",
      "Review page and QR code",
      "Weekly rank email and a monthly report",
    ],
  },
  {
    id: "growth" as const,
    name: "Growth",
    price: 199,
    recommended: true,
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
    a: "Automatic replies only go to 4 and 5 star reviews, and only if you turn that on. Reviews of 1 to 3 stars are left for you, because they need a human answer.",
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

const NAV = [
  ["How it works", "#how"],
  ["Features", "#features"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
] as const;

export default function HomePage() {
  return (
    <div className="v2 min-h-dvh bg-canvas text-fg">
      <a
        href="#main"
        className="sr-only z-[60] rounded-lg bg-accent px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Industries />
        <Problem />
        <Features />
        <MapCheck />
        <Control />
        <Testimonials />
        <HowItWorks />
        <Pricing />
        <Founder />
        <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <SectionHeading center eyebrow="FAQ" title="Questions people ask before they start" />
            <Faq items={FAQS} />
          </div>
        </section>
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- building blocks ---------- */

function Button({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: "primary" | "secondary"; size?: "md" | "lg"; arrow?: boolean }) {
  return (
    <Link
      className={clsx(
        "group/btn inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors duration-150",
        variant === "primary"
          ? "bg-accent text-white shadow-[0_1px_2px_rgb(16_24_40/0.12)] hover:bg-accent-hover"
          : "border border-line-strong bg-surface text-fg hover:bg-subtle",
        size === "lg" ? "min-h-12 px-5 text-[15px]" : "min-h-10 px-4 text-sm",
        className,
      )}
      {...props}
    >
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform duration-150 group-hover/btn:translate-x-0.5" aria-hidden />}
    </Link>
  );
}

function SectionHeading({ eyebrow, title, intro, center }: { eyebrow: string; title: ReactNode; intro?: string; center?: boolean }) {
  return (
    <div className={clsx("max-w-2xl", center && "mx-auto text-center")}>
      <p className="text-sm font-semibold text-accent-text">{eyebrow}</p>
      <h2 className="mt-3 text-3xl leading-tight text-fg sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

function IconBox({ children }: { children: ReactNode }) {
  return <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-text [&>svg]:size-5">{children}</span>;
}

function TrustLine({ className }: { className?: string }) {
  const items = ["3-day free trial", "No contract", "Cancel any time"];
  return (
    <ul className={clsx("flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted", className)}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-1.5">
          <CircleCheck className="size-4 text-rank-good" aria-hidden /> {t}
        </li>
      ))}
      {guarantee && (
        <li className="flex items-center gap-1.5 font-medium text-fg">
          <ShieldCheck className="size-4 text-rank-good" aria-hidden /> {guarantee.title}
        </li>
      )}
    </ul>
  );
}

/* ---------- sections ---------- */

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-lg">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle className="grid size-10 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-subtle hover:text-fg" />
          <Link href="/login" className="hidden min-h-10 items-center rounded-md px-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg sm:inline-flex">
            Log in
          </Link>
          <Button href={trialHref()}>Start free trial</Button>
        </div>
      </Container>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* One soft wash of brand colour behind the product; nothing else decorative. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(60%_60%_at_75%_10%,var(--color-accent-soft),transparent_70%)]" />
      <Container className="relative grid grid-cols-1 items-center gap-14 pt-16 pb-16 sm:pt-24 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm font-medium text-muted">
            <MapPin className="size-4 text-accent-text" aria-hidden /> Local SEO for Google Business Profiles
          </p>
          <h1 className="mt-6 text-[40px] leading-[1.08] text-fg sm:text-5xl lg:text-[56px]">
            Your Google profile, handled every week.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Ranklit posts updates, replies to your good reviews and fixes what is missing on your Google Business Profile. Then
            it checks your position from 49 spots around you, so you <strong className="font-semibold text-fg">see where you rank, not a guess.</strong>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={trialHref()} size="lg" arrow>
              Start your 3-day free trial
            </Button>
            <Button href="#how" size="lg" variant="secondary">
              See how it works
            </Button>
          </div>
          <TrustLine className="mt-6" />
          <p className="mt-3 text-sm text-muted">From $99 a month per location.</p>
        </div>
        <Dashboard />
      </Container>
      <Stats />
    </section>
  );
}

/** A calm, static preview of the product: this week's numbers, the rank map and the activity log. */
function Dashboard() {
  const now = gridStats(LATEST_SCAN);
  const then = gridStats(FIRST_SCAN);
  return (
    <figure className="mx-auto w-full max-w-[560px] lg:mr-0">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgb(16_24_40/0.04),0_24px_48px_-16px_rgb(16_24_40/0.18)]">
        <div className="flex items-center gap-2 border-b border-line bg-subtle px-4 py-3" aria-hidden>
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="ml-3 text-xs font-medium text-muted">Ranklit · Your business</span>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-[1fr_1.1fr] sm:p-5">
          <div className="space-y-3">
            <div className="rounded-xl border border-line p-4">
              <p className="text-xs text-muted">Top 3 spots · “plumber near me”</p>
              <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">
                {now.top3}
                <span className="text-sm font-medium text-muted"> / {now.total}</span>
              </p>
              <p className="mt-1 text-xs font-medium text-rank-good">up from {then.top3} in week 1</p>
            </div>
            <div className="rounded-xl border border-line p-4">
              <p className="text-xs text-muted">Average position</p>
              <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">{now.avg}</p>
              <p className="mt-1 text-xs font-medium text-rank-good">was {then.avg} in week 1</p>
            </div>
          </div>
          <div className="rounded-xl border border-line p-3">
            <div className="mx-auto grid max-w-[220px] grid-cols-7 gap-1.5 sm:max-w-none" aria-hidden>
              {LATEST_SCAN.flat().map((r, n) => (
                <span key={n} className={clsx("aspect-square rounded-full", DOT_BG[rankTone(r)], n === 24 && "ring-2 ring-fg ring-offset-1 ring-offset-surface")} />
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted">49-point map scan, week 8</p>
          </div>
        </div>
        <div className="border-t border-line px-4 pt-3 pb-2 sm:px-5">
          <p className="text-xs font-semibold text-muted">This week</p>
          <ul className="mt-1 divide-y divide-line">
            {FEED.slice(0, 3).map((f) => (
              <li key={f.title} className="flex items-center gap-3 py-2.5 text-sm">
                <f.icon className="size-4 shrink-0 text-muted" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-fg">{f.title}</span>
                <span className="shrink-0 text-xs text-muted tabular-nums">{f.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted">Sample dashboard with illustrative data. Google decides rankings.</figcaption>
    </figure>
  );
}

function Stats() {
  if (stats.length === 0) return null;
  return (
    <Container className="relative pb-16">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface px-6 py-5">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-fg tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}

function Industries() {
  return (
    <div className="border-y border-line bg-subtle">
      <Container className="py-6 text-center text-sm text-muted">
        Built for local service businesses: <span className="text-fg">{INDUSTRIES.join(", ")}</span> and more.
      </Container>
    </div>
  );
}

function Problem() {
  const items = [
    { icon: Wallet, title: "Agencies cost a lot", text: "Local SEO agencies often charge $1,500 or more a month, and send a report once a month that is hard to check." },
    { icon: Clock, title: "Doing it yourself never gets done", text: "Posting every week, answering every review, keeping hours and photos right. It is the first thing to slip." },
    { icon: Search, title: "You can’t see your real rank", text: "Search from your own phone and you see one spot. Customers across town see something else." },
  ];
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="The problem" title="Local SEO is simple work. It just never stops." />
        <Reveal className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-line bg-surface p-6">
              <IconBox>
                <it.icon />
              </IconBox>
              <h3 className="mt-5 text-lg text-fg">{it.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{it.text}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-y border-line bg-subtle py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What Ranklit does"
          title="The weekly work Google rewards, done for you"
          intro="Each task runs on a schedule, and every action is logged so you can see it."
        />
        <Reveal className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-surface p-6">
              <IconBox>
                <f.icon />
              </IconBox>
              <h3 className="mt-5 text-lg text-fg">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function MapCheck() {
  const steps = [
    { title: "Each dot is a spot near you", text: "We search the way a customer standing there would. The ringed dot in the middle is your business." },
    { title: "The number is your position", text: "1 means you came up first for that search at that spot." },
    { title: "Green means top 3", text: "That is where most calls go. Watch the green spread week by week." },
  ];
  return (
    <section id="map-check" className="scroll-mt-20 py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <SectionHeading
            eyebrow="The weekly map scan"
            title="Your rank from 49 spots, not one"
            intro="Your phone shows you one list. A customer two miles away sees a different one. So every week we search from 49 spots around your business and put every result on one map."
          />
          <ol className="mt-8 space-y-5">
            {steps.map((s, n) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong text-sm font-semibold text-fg">{n + 1}</span>
                <span>
                  <span className="block font-semibold text-fg">{s.title}</span>
                  <span className="mt-0.5 block text-muted">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-rank-good" /> Top 3</li>
            <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-rank-mid" /> 4 to 10</li>
            <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-rank-bad" /> 11 or lower</li>
          </ul>
        </Reveal>
        <div className="mx-auto w-full max-w-[480px] lg:mr-0">
          <RankMap before={FIRST_SCAN} after={LATEST_SCAN} keyword="plumber near me" />
          <p className="mt-3 text-center text-xs text-muted">Switch weeks to compare. Sample data, not a customer.</p>
        </div>
      </Container>
    </section>
  );
}

function Control() {
  return (
    <section className="border-y border-line bg-subtle py-20 sm:py-28">
      <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow="Transparency and control"
            title="Nothing happens behind your back"
            intro="Every post, reply, fix and scan is logged in your activity feed, and a summary lands in your inbox each week. Your profile stays yours."
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {CONTROL.map((c) => (
              <li key={c.title}>
                <IconBox>
                  <c.icon />
                </IconBox>
                <p className="mt-4 font-semibold text-fg">{c.title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{c.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        <figure className="rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgb(16_24_40/0.04),0_12px_32px_-12px_rgb(16_24_40/0.12)] lg:mt-10">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p className="font-semibold text-fg">Activity this week</p>
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
              <BellRing className="size-3.5" aria-hidden /> Weekly email on
            </span>
          </div>
          <ul className="divide-y divide-line">
            {FEED.map((f) => (
              <li key={f.title} className="flex items-center gap-3 px-5 py-3.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-subtle text-muted">
                  <f.icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] text-fg">{f.title}</span>
                  <span className="block text-xs text-muted">{f.time}</span>
                </span>
                <Check className="size-4 shrink-0 text-rank-good" aria-label="Done" />
              </li>
            ))}
          </ul>
          <figcaption className="border-t border-line px-5 py-3 text-center text-xs text-muted">Sample week</figcaption>
        </figure>
      </Container>
    </section>
  );
}

function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading center eyebrow="Customers" title="What business owners say" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name + t.business} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
              <blockquote className="flex-1 leading-relaxed text-fg">“{t.quote}”</blockquote>
              {t.result && <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-sm font-medium text-accent-text">{t.result}</p>}
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar name={t.name} photo={t.photo} />
                <span>
                  <span className="block font-semibold text-fg">{t.name}</span>
                  <span className="block text-sm text-muted">
                    {t.business}, {t.city}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Avatar({ name, photo, size = 44 }: { name: string; photo?: string; size?: number }) {
  if (photo) return <Image src={photo} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="grid shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-semibold text-accent-text" style={{ width: size, height: size }} aria-hidden>
      {initials}
    </span>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Connect Google", text: "Sign in with the account that runs your Business Profile. About a minute." },
    { title: "Check your plan", text: "We suggest the searches to track and what to automate. Edit anything, turn off what you don’t want." },
    { title: "Watch it work", text: "Posts, replies and your first map scan start that week." },
  ];
  return (
    <section id="how" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionHeading center eyebrow="How it works" title="Five minutes to set up. Then it runs." />
        <Reveal as="ol" className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          <span aria-hidden className="absolute top-5 right-[16.6%] left-[16.6%] hidden h-px bg-line-strong md:block" />
          {steps.map((s, n) => (
            <li key={s.title} className="relative text-center">
              <span className="relative mx-auto grid size-10 place-items-center rounded-full bg-accent text-sm font-semibold text-white ring-8 ring-canvas">{n + 1}</span>
              <h3 className="mt-5 text-lg text-fg">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-[280px] leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 border-y border-line bg-subtle py-20 sm:py-28">
      <Container>
        <SectionHeading center eyebrow="Pricing" title="Two plans, priced per location" intro="Start with a 3-day free trial. No contract, cancel in one click." />
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={clsx(
                "relative flex flex-col rounded-2xl border bg-surface p-7 sm:p-8",
                p.recommended ? "border-accent shadow-[0_0_0_1px_var(--color-accent),0_24px_48px_-20px_rgb(141_62_187/0.35)]" : "border-line",
              )}
            >
              {p.recommended && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">Recommended</span>
              )}
              <h3 className="text-xl text-fg">{p.name}</h3>
              <p className="mt-1 text-muted">{p.blurb}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="text-5xl font-semibold tracking-tight text-fg tabular-nums">${p.price}</span>
                <span className="text-muted">/month per location</span>
              </p>
              <ul className="mt-7 mb-8 space-y-3 text-[15px]">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-fg">
                    <Check className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Button href={trialHref(p.id)} variant={p.recommended ? "primary" : "secondary"} size="lg" className="mt-auto w-full" arrow>
                Start free trial
              </Button>
            </div>
          ))}
        </div>
        {guarantee && (
          <div className="mx-auto mt-8 flex max-w-4xl items-start gap-4 rounded-2xl border border-line bg-surface p-6">
            <ShieldCheck className="mt-0.5 size-6 shrink-0 text-rank-good" aria-hidden />
            <div>
              <p className="font-semibold text-fg">{guarantee.title}</p>
              <p className="mt-1 text-muted">{guarantee.detail}</p>
            </div>
          </div>
        )}
        <TrustLine className="mt-8 justify-center" />
      </Container>
    </section>
  );
}

function Founder() {
  if (!founder) return null;
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <div className="flex flex-col gap-8 rounded-2xl border border-line bg-surface p-8 sm:flex-row sm:items-start">
          <Avatar name={founder.name} photo={founder.photo} size={96} />
          <div>
            <p className="text-sm font-semibold text-accent-text">Who is behind Ranklit</p>
            <p className="mt-3 text-lg leading-relaxed text-fg">{founder.bio}</p>
            <p className="mt-5 font-semibold text-fg">{founder.name}</p>
            <p className="text-sm text-muted">
              {founder.role} ·{" "}
              <a href={`mailto:${site.email}`} className="text-accent-text underline underline-offset-4">
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 font-semibold text-fg [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden className="relative grid size-6 shrink-0 place-items-center text-muted transition-transform duration-200 group-open:rotate-45">
                <span className="absolute h-[1.5px] w-3.5 rounded bg-current" />
                <span className="absolute h-3.5 w-[1.5px] rounded bg-current" />
              </span>
            </summary>
            <p className="max-w-2xl pb-5 leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-8 text-center text-muted">
        Still have a question? Email{" "}
        <a href={`mailto:${site.email}`} className="font-medium text-accent-text underline underline-offset-4">
          {site.email}
        </a>
        . A real person will write back.
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

function FinalCta() {
  return (
    <section className="px-5 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto max-w-6xl rounded-2xl border border-line bg-subtle px-6 py-16 text-center sm:px-12 sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl leading-tight text-fg sm:text-4xl">See where you rank this week.</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">Connect Google and your first map scan runs the same day.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={trialHref()} size="lg" arrow>
            Start your 3-day free trial
          </Button>
          <Button href="#pricing" size="lg" variant="secondary">
            Compare plans
          </Button>
        </div>
        <TrustLine className="mt-6 justify-center" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="py-12 text-sm text-muted">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs leading-relaxed">Weekly local SEO for Google Business Profiles.</p>
            {company && (
              <address className="mt-4 leading-relaxed not-italic">
                {company.legalName}
                {company.address && <span className="block">{company.address}</span>}
                {company.phone && (
                  <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`} className="block hover:text-fg">
                    {company.phone}
                  </a>
                )}
              </address>
            )}
          </div>
          <nav aria-label="Product" className="flex flex-col gap-1">
            <p className="mb-1 font-semibold text-fg">Product</p>
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="inline-flex min-h-9 items-center hover:text-fg">
                {label}
              </a>
            ))}
          </nav>
          <nav aria-label="Company" className="flex flex-col gap-1">
            <p className="mb-1 font-semibold text-fg">Company</p>
            <Link href="/privacy" className="inline-flex min-h-9 items-center hover:text-fg">Privacy</Link>
            <Link href="/terms" className="inline-flex min-h-9 items-center hover:text-fg">Terms</Link>
            <a href={`mailto:${site.email}`} className="inline-flex min-h-9 items-center hover:text-fg">{site.email}</a>
          </nav>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed">
          © {company?.legalName ?? "Ranklit"}. Rank maps, dashboards and activity shown on this page are illustrative samples, not customer
          data. Google decides rankings; no one can guarantee a position. Ranklit is not affiliated with Google.
        </p>
      </Container>
    </footer>
  );
}
