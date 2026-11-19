export const site = {
  name: "Ranklit",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "support@ranklit.com",
  description:
    "Ranklit works on your Google Business Profile every week: posts, review replies, profile checks and a 49-point Google Maps rank scan you can see.",
};

export const trialHref = (plan: "foundation" | "growth" = "foundation") => `/checkout?plan=${plan}`;
