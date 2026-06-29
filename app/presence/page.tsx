import type { Metadata } from "next";
import PackageLanding from "@/components/PackageLanding";
import { getTierBySlug } from "@/lib/tiers";

const tier = getTierBySlug("presence")!;

export const metadata: Metadata = {
  title: `Presence — ${tier.outcome} | GrowVera`,
  description:
    "Presence by GrowVera: a modern website built, hosted and kept current for your business, your Google listing sorted, and regular posts — from $890/mo. Done for you.",
};

export default function PresencePage() {
  return <PackageLanding tier={tier} />;
}
