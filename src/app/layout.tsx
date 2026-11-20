import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter_Tight } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ranklit: Local SEO on Autopilot for Your Google Business Profile",
    template: "%s | Ranklit",
  },
  description: site.description,
  openGraph: { siteName: site.name, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#fff8ec",
};

// Every visit starts light. Dark lasts only for the current tab session (sessionStorage), so a reload keeps it
// but a new visit is light again. Runs before paint so there's no flash on reload.
// Revert to "remember forever": swap sessionStorage back to localStorage here and in theme-toggle.tsx.
const themeScript = `try{localStorage.removeItem("theme");document.documentElement.dataset.theme=sessionStorage.getItem("theme")==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} ${bricolage.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* suppressHydrationWarning: extensions like Grammarly add attributes to <body> before React loads. Only this tag. */}
      <body className="min-h-dvh" suppressHydrationWarning>{children}</body>
    </html>
  );
}
