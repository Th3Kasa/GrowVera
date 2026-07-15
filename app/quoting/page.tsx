import type { Metadata } from "next";
import PackageLanding from "@/components/PackageLanding";
import { getTierBySlug } from "@/lib/tiers";

const tier = getTierBySlug("quoting")!;

export const metadata: Metadata = {
  title: "AI Quoting Agent — quotes done in seconds | GrowVera",
  description:
    "GrowVera builds you an instant quoting tool wired to your own price lists, labour rates, and margins. Quotes that took 15 minutes take seconds. Custom build from $10,000 setup plus monthly care.",
};

export default function QuotingPage() {
  return <PackageLanding tier={tier} />;
}
