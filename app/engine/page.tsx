import type { Metadata } from "next";
import PackageLanding from "@/components/PackageLanding";
import { getTierBySlug } from "@/lib/tiers";

const tier = getTierBySlug("engine")!;

export const metadata: Metadata = {
  title: `Engine — ${tier.outcome} | GrowVera`,
  description:
    "Engine by GrowVera: a full done-for-you content machine — posts and short videos every week, posted across your channels — from $1,990/mo. You just approve.",
};

export default function EnginePage() {
  return <PackageLanding tier={tier} />;
}
