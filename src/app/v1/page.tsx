// v1 "warm & map-led": the unslopped v1. Same honest sections as the home page (src/components/v2/landing.tsx),
// in v1's warm skin (cream paper, ink text, lime action, Bricolage headings) with the realistic phone as the hero.
// The original sticker v1 is kept at /v1-sticker (src/app/v1-sticker/page.tsx).
import type { Metadata } from "next";
import { Landing } from "@/components/v2/landing";
import { PhoneDevice } from "@/components/phone-device";
import { MotionToggle } from "@/components/motion-toggle";

export const metadata: Metadata = { title: "Design v1 warm", robots: { index: false, follow: false } };

export default function V1WarmPage() {
  return (
    <Landing
      className="warm"
      visual={
        <div className="flex flex-col items-center pt-10 lg:pt-0">
          <PhoneDevice calm />
          {/* The phone auto-advances, so it needs a pause control (WCAG 2.2.2). */}
          <MotionToggle className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm text-muted transition-colors duration-150 hover:text-fg sm:min-h-9" />
        </div>
      }
    />
  );
}
