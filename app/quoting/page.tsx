import type { Metadata } from "next";
import PackageLanding from "@/components/PackageLanding";
import QuotingDemo from "@/components/demo/QuotingDemo";
import { getTierBySlug } from "@/lib/tiers";

const tier = getTierBySlug("quoting")!;

export const metadata: Metadata = {
  title: "AI Quoting Agent — quotes done in seconds | GrowVera",
  description:
    "GrowVera builds your team an in-house quoting tool wired to your own price lists, rates and margins — only your staff use it. Quotes that ate 15 minutes take seconds. Custom build from $12,000 setup plus monthly care.",
};

export default function QuotingPage() {
  return <PackageLanding tier={tier} demo={<QuotingDemo />} />;
}
