import type { ReactNode } from "react";
import { site } from "@/lib/site";

export type FaqItem = { q: string; a: ReactNode };

/** Accordion built on native <details>; several items can be open at once. Emits FAQPage JSON-LD. */
export function Faq({ items, footer = true }: { items: { q: string; a: string }[]; footer?: boolean }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <div>
      <div className="mt-12 space-y-4">
        {items.map((item) => (
          <details key={item.q} className="group rounded-3xl border-2 border-ink bg-white px-6 shadow-pop transition-[background-color,transform] duration-200 ease-out hover:-translate-y-0.5 open:bg-[#ffedb2]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold tracking-tight [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="relative grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-lime text-ink transition-[transform,background-color,color] duration-300 ease-[var(--ease-spring)] group-open:rotate-[135deg] group-open:bg-ink group-open:text-lime dark:group-open:bg-lime!" aria-hidden>
                <span className="absolute h-[2px] w-3 rounded bg-current" />
                <span className="absolute h-3 w-[2px] rounded bg-current" />
              </span>
            </summary>
            <p className="max-w-2xl pb-6 leading-relaxed text-ink-2">{item.a}</p>
          </details>
        ))}
      </div>
      {footer && (
        <p className="mt-10 text-center text-ink-2">
          Still curious? Email{" "}
          <a href={`mailto:${site.email}`} className="font-bold text-brand-700 underline decoration-2 underline-offset-4 hover:decoration-wavy">
            {site.email}
          </a>
          . A real person will write back.
        </p>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
