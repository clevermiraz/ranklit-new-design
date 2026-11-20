// Home page: the unslopped landing in its v2 "clean SaaS" skin. Sections live in src/components/v2/landing.tsx.
import { Dashboard, Landing } from "@/components/v2/landing";

export default function HomePage() {
  return <Landing visual={<Dashboard />} />;
}
