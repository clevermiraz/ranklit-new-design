# Ranklit design system

The rulebook for every Ranklit page. The landing page (`src/app/page.tsx`) is the reference build. When in doubt, copy how it does things. Logo rules live in `BRAND.md`.

**The style: "sticker map".** Warm cream paper, thick ink outlines, hard offset shadows, candy colours and a quirky display font. Playful and honest. Motion explains things or adds a moment of delight, and it never blocks content.

---

## 1. Colour tokens (`src/app/globals.css`, `@theme`)

Always use the tokens through Tailwind classes (`bg-paper`, `text-ink`, `border-ink`). **Never hard-code hex in a page.** Dark mode only works because everything goes through tokens.

| Token | Light | Use |
| --- | --- | --- |
| `paper` | `#fff8ec` | Page background |
| `paper-2` | `#fdeed6` | Alternate section background (Features, Pricing, footer) |
| `ink` | `#1a1523` | Text, 2px outlines, hard shadows |
| `ink-2` | `#5b5367` | Secondary text (6.9:1 on paper) |
| `night` | `#1a1523` | Dark *backgrounds* that stay dark in both themes (ticker, Activity feed). Use this, not `bg-ink`, for a dark band |
| `white` | `#fff` | Cards (`bg-white`) |
| `lime` | `#c6f432` | Primary pop: header CTA, highlights, "you" |
| `sun` | `#ffd23f` | Highlights, nav hover, badges |
| `bubblegum` | `#ff9ed2` | Accent cards and stickers |
| `sky` | `#8fd3ff` | Accent cards |
| `mint` | `#9df0c8` | "Done" / success chips |
| `tangerine` | `#ff7a3d` | Small accents (the hero squiggle) |
| `brand-600` | `#9b47cc` | Primary button, brand purple, the lit dot |
| `rank-good` / `rank-mid` / `rank-bad` | green / amber / red | Rank data only. Always pair with a number or label |

Rules:
- Text on any candy colour is `ink`. White text goes only on `brand-600`, `night` or `ink`.
- Use at most two candy colours per component. Rotate colours across sibling cards (sun → bubblegum → sky).
- Shadows use `--pop` (set per theme), never `ink` directly.

## 2. Typography

- **Display (h1–h3):** Bricolage Grotesque ExtraBold (`--font-display`, applied automatically to h1–h3). Add `tracking-display` (-0.035em) to big headings.
- **Body:** Inter Tight (`font-sans`, the default).
- **Scale used on the landing page:**
  - h1: `text-[50px] sm:text-7xl lg:text-[84px] leading-[0.95]`
  - section h2: `text-4xl sm:text-5xl lg:text-6xl leading-[1.02]`
  - card h3: `text-2xl`
  - body: `text-lg leading-relaxed`
  - small print: `text-sm` or `text-xs`
- Headings get `text-wrap: balance` and paragraphs `text-wrap: pretty`, both automatic.
- **Typography details:**
  - curly quotes and apostrophes (“ ” ’), the … character
  - `tabular-nums` on prices, ranks and stats
  - sentence case for headings and buttons

## 3. Shape, outlines and shadows

- Every card, button and chip has a **`border-2 border-ink`** outline.
- Hard shadows: `shadow-pop-sm` (2px) for chips, `shadow-pop` (4px) for cards and buttons, `shadow-pop-lg` (8px) for hero objects.
- Radius: chips and buttons `rounded-full`, cards `rounded-3xl`, big blocks `rounded-[32px]`–`[40px]`. A child radius is always smaller than its parent's.
- Playful tilt: `-rotate-1` to `rotate-2` on stickers and cards, straightening on hover (`hover:rotate-0`). Never tilt body text blocks.
- Background texture: `bg-dots` (it follows the theme).

## 4. Components (reuse these, don't rebuild)

| Component | File | Notes |
| --- | --- | --- |
| `Container` | `components/ui.tsx` | `max-w-6xl`, standard side padding |
| `ButtonLink` | `components/ui.tsx` | Variants `primary` (purple), `lime`, `light`; sizes `sm`/`md`/`lg`; `arrow`. Lifts on hover and squashes on press. It's a `<Link>` (navigation is always a link) |
| `Eyebrow` | `components/ui.tsx` | Tilted sticker label above headings. Pass `className="bg-lime"` etc. to recolour |
| `SectionHeading` | `components/ui.tsx` | Eyebrow + h2 + optional `highlight` (highlighter swipe, `marker` colour) + `intro`. Reveals on scroll |
| `Stars` | `components/ui.tsx` | Accessible star rating |
| `Reveal` | `components/reveal.tsx` | Scroll reveal. `stagger` + children with `data-item` and `style={{"--i": n}}` enter in sequence. `data-pop` pops instead of rising |
| `Faq` | `components/faq.tsx` | Native `<details>` accordion + FAQPage JSON-LD |
| `Logo`, `LogoMark`, `Wordmark` | `components/logo.tsx` | **Generated.** Never hand-edit (see BRAND.md) |
| `ThemeToggle` | `components/theme-toggle.tsx` | Sun/moon in the header |
| `MotionToggle` | `components/motion-toggle.tsx` | Pause/play for every looping animation (required, see §7) |
| `RankScan`, `RankLegend`, `MapBackdrop` | `components/rank-scan.tsx`, `rank-grid.tsx` | 49-point map scan |
| `PhoneDevice` / `PhoneSim` | `components/phone-device.tsx` / `phone-sim.tsx` | Hero phones. Both share `useClimb` and `SCENARIOS` (six industries, random start, next on each replay) |

Section rhythm: `py-24 sm:py-32`. Alternate `paper` and `paper-2` (with `border-y-2 border-ink`) and use one `night` band per page at most. Anchored sections get `scroll-mt-24` so the sticky header doesn't cover them.

## 5. Motion

- Easing tokens: `--ease-out` (entrances), `--ease-spring` (playful pops and hovers), `--ease-in-out` (drawing).
- Keyframe utilities:
  - `animate-rise` (load-in, staggered with `animationDelay`)
  - `animate-pop`
  - `animate-bob` (floating stickers; set `--r` for tilt)
  - `animate-marquee`
  - `animate-spin-slow`
  - `animate-words` (6-word rotator)
  - `animate-draw` (SVG squiggle; use `pathLength={1} strokeDasharray="1"`)
  - `animate-ping-once`
- Animate only `transform` and `opacity` (plus `stroke-dashoffset` for drawing). Never `transition: all`; list the properties.
- Hover: lift (`-translate-y-1`) and grow the shadow. Press: `active:translate-x-1 active:translate-y-1 active:shadow-none`.
- Prefer CSS. JS animation (like `useClimb`) must run **only while on screen**, respect the pause toggle (`html[data-motion="paused"]`) and degrade under reduced motion.

## 6. Dark mode (v3, "lime night glow")

**Light is the default for everyone.** Dark is opt-in through the header toggle, and the choice lasts only for the tab session (`sessionStorage.theme`), so every new visit starts light. `layout.tsx` sets `html[data-theme]` before paint, so there's no flash. The switch is one GPU crossfade (View Transitions API, `FADE` in `theme-toggle.tsx`); never animate colours per element, it janks on a long page.

Inspired by Lime Duo and H2 on darkmodedesign.com, within the dark-mode-design skill's rules. Most of it is automatic through tokens:
- **Neutral black** `#0a0a0b` (not tinted), with a faint 48px grid (`bg-dots` turns into a grid in dark).
- **One light source per view:** the hero has a lime and purple radial glow behind the phone. Use glows sparingly: a hero light source and the closing CTA. Don't glow every section.
- **Glass cards:** `bg-white` becomes `--s1` `#121214`, with a faint top highlight (`--glass`) and a hairline `--line` edge (9% white). Raised items (cards in cards, the open FAQ, the header) are `--s2` `#19191d`.
- **No hard shadows in dark** (`--pop` is transparent). Lime and purple **buttons glow** instead, and the glow grows on hover.
- **Text:** off-white `#f2f1ee`, muted `#a3a3ab`.
- **Lime stays full strength** because it's the light source. Other accents are about 15% calmer. Small candy chips stay bright with dark text, automatically.
- **Large candy areas must carry the class `tint`** (`className="tint bg-sun …"`). In dark they become black glass with their colour **glowing in from the top edge**. It does nothing in light mode. A `tint bg-brand-600` block becomes the purple + lime "glow moment" (used by the final CTA).
- **Highlighted words** (`.marker`) become coloured text with a soft glow.
- **Imagery:** maps get `map-dim` (built into `MapBackdrop`). The hero phone uses the `.maps` night palette (`--m-*`).
- Special cases use the `dark:` variant (e.g. `dark:text-brand-400` for purple text, `dark:group-open:bg-lime!` on the FAQ icon).
- Test every new component in **both** themes, at 360px too.

Backups: `src/app/theme-dark-v1.css` (bright stickers on black) and `src/app/theme-dark-v2.css` (calm tinted surfaces). Each has restore steps at the top.

## 7. Accessibility and quality rules (non-negotiable)

These came out of the QA rounds against the Vercel Web Interface Guidelines and Chrome's modern web guidance.
- **Page structure:** one `<h1>` per page and no skipped heading levels. `header`, `nav aria-label`, `main id="main"` and `footer`. The skip link is in the page header.
- **Contrast:** at least 4.5:1 for text (3:1 for 24px+ bold). Never put white text on lime, sun or mint.
- **Touch targets:** at least 44px on touch devices and 24px with a mouse. Use `min-h-11`, `size-11` and `shrink-0` on icon buttons.
- **Labels:** icon-only buttons have an `aria-label`. Decorative SVG and stickers get `aria-hidden`. Animated demos have a `sr-only` text summary. Use `aria-label` only on interactive elements or `role="img"`.
- **Colour is never the only signal:** rank colours always come with numbers.
- **Looping or auto-updating motion** needs the pause control (`MotionToggle`) and must stop under `prefers-reduced-motion`. Hidden-until-revealed content must end visible.
- **Mobile layout:**
  - nothing may overflow the viewport at 360px
  - grid children that hold long text need `min-w-0` / `grid-cols-[minmax(0,1fr)]`
  - buttons don't wrap (`whitespace-nowrap` is built into `ButtonLink`)
  - tuck absolutely-positioned stickers inside the screen on small sizes (e.g. `-right-2 sm:-right-6`)
- **Honesty:** sample data is labelled as a sample ("Sample animation, not a promise"). Use made-up business names, never invented testimonials, and never promise a rank.
- **Legal:** no Google logo or name inside mockups. Look-alike UI is a trade-dress risk, so check with an attorney before launch.

## 8. New page template

```tsx
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { trialHref } from "@/lib/site";
import type { CSSProperties } from "react";

const i = (n: number) => ({ "--i": n }) as CSSProperties; // stagger index

export default function SomePage() {
  return (
    <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="Label" title="Plain, short headline." highlight="The fun part." marker="var(--color-lime)" intro="One sentence that explains it." />
          <Reveal stagger className="mt-16 grid gap-6 md:grid-cols-3">
            {items.map((it, n) => (
              <div key={it.title} data-item="" style={i(n)}
                   className="tint rounded-3xl border-2 border-ink bg-sun p-7 shadow-pop transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-2">
                …
              </div>
            ))}
          </Reveal>
          <ButtonLink href={trialHref()} size="lg" arrow className="mt-10">Start your 3-day free trial</ButtonLink>
        </Container>
      </section>
    </main>
  );
}
```
Reuse the landing page's `Header` and `Footer` (move them into `src/components/` when a second page needs them) so the theme toggle, skip link and logo stay consistent.

## 9. Before you ship a page: checklist

- [ ] Only tokens are used, with no raw hex outside mockup internals.
- [ ] Large candy panels have `tint`, and dark mode has been checked.
- [ ] It's checked at 360, 390, 768, 1440 and 2560px, with no sideways scroll and nothing clipped.
- [ ] Keyboard: everything is reachable, the focus ring is visible, and the skip link works.
- [ ] Turning on reduced motion stops loops and leaves nothing invisible. The pause button works.
- [ ] The console has no errors or hydration warnings.
- [ ] `npx tsc --noEmit`, `npm run lint` and `npm run build` all pass.
- [ ] The previous version of anything redesigned is kept as a switchable backup (the team rule).
