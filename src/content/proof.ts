/**
 * Trust proof for the landing page. ONLY REAL DATA GOES HERE.
 *
 * Every section that reads from this file is hidden while its value is empty or null, so the page never shows
 * placeholder or invented proof. Fill a field in and its section appears on the next build.
 *
 * - Testimonials: real customers, with their permission to use name, business and city (and photo, if given).
 * - Stats: numbers you can back up if asked (e.g. from your database), not estimates.
 * - Guarantee: only terms you will actually honor. It is shown next to every trial button and in pricing.
 * - Founder / company: real people and real contact details. These are the strongest "this is a real business" signals.
 */

export type Testimonial = {
  quote: string;
  name: string;
  business: string;
  city: string;
  /** Path under /public, e.g. "/proof/maria.jpg". Optional; initials are shown without it. */
  photo?: string;
  /** Optional measured result to show under the quote, e.g. "Top 3 in 31 of 49 spots after 8 weeks". */
  result?: string;
};

export const testimonials: Testimonial[] = [];

/** e.g. { value: "120+", label: "local businesses served" }. Shown as a row under the hero. Use 3 or 4. */
export const stats: { value: string; label: string }[] = [];

/** e.g. { title: "30-day money-back guarantee", detail: "Not happy in your first 30 days? Email us and we refund you in full." } */
export const guarantee: { title: string; detail: string } | null = null;

/** The people behind Ranklit. */
export const founder: {
  name: string;
  role: string;
  /** Path under /public. A real photo matters more than anything else here. */
  photo?: string;
  /** 2 to 4 sentences in your own voice: who you are, why you built this. */
  bio: string;
} | null = null;

/** Real company details for the footer. Address and phone are strong trust signals for local-business buyers. */
export const company: {
  legalName: string;
  address?: string;
  phone?: string;
} | null = null;
