/** Rank dot colours for v2. Shared by server and client components, so it lives outside any "use client" file. */
export const DOT_TONE = {
  good: "bg-rank-good text-white",
  mid: "bg-rank-mid text-[#1a1523]",
  bad: "bg-rank-bad text-white",
} as const;

export const DOT_BG = { good: "bg-rank-good", mid: "bg-rank-mid", bad: "bg-rank-bad" } as const;
