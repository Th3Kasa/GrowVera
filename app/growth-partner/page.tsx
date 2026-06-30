import type { Metadata } from "next";
import PackageLanding from "@/components/PackageLanding";
import { getTierBySlug } from "@/lib/tiers";

const tier = getTierBySlug("growth-partner")!;

export const metadata: Metadata = {
  title: `Growth Partner — ${tier.outcome} | GrowVera`,
  description:
    "Growth Partner by GrowVera: we create and run your Facebook & Instagram ads and deliver leads to you — from $1,990/mo plus ad spend. Managed end to end.",
};

export default function GrowthPartnerPage() {
  return <PackageLanding tier={tier} />;
}
