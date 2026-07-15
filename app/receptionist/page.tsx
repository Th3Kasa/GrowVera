import type { Metadata } from "next";
import PackageLanding from "@/components/PackageLanding";
import { getTierBySlug } from "@/lib/tiers";

const tier = getTierBySlug("receptionist")!;

export const metadata: Metadata = {
  title: "24/7 AI Receptionist for tradies — never miss a call | GrowVera",
  description:
    "GrowVera's AI receptionist answers every call you can't take — on the tools, after hours, on a break. It captures the job, books it, and texts you a summary. From $500/mo, no setup fee.",
};

export default function ReceptionistPage() {
  return <PackageLanding tier={tier} />;
}
