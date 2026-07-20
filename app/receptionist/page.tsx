import type { Metadata } from "next";
import PackageLanding from "@/components/PackageLanding";
import ReceptionistCallDemo from "@/components/demo/ReceptionistCallDemo";
import { getTierBySlug } from "@/lib/tiers";

const tier = getTierBySlug("receptionist")!;

export const metadata: Metadata = {
  title: "24/7 AI Receptionist for tradies — never miss a call | GrowVera",
  description:
    "GrowVera's AI receptionist answers every call you can't take — on the tools, after hours, on a break. It only picks up when you don't, captures the job, books it, and texts you a summary. Priced to your business on a free AI audit call.",
};

export default function ReceptionistPage() {
  return <PackageLanding tier={tier} demo={<ReceptionistCallDemo />} />;
}
