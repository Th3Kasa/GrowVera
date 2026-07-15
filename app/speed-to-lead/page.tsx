import type { Metadata } from "next";
import PackageLanding from "@/components/PackageLanding";
import SpeedToLeadDemo from "@/components/demo/SpeedToLeadDemo";
import { getTierBySlug } from "@/lib/tiers";

const tier = getTierBySlug("speed-to-lead")!;

export const metadata: Metadata = {
  title: "Speed-to-Lead Agent — call every web lead back in 20 seconds | GrowVera",
  description:
    "GrowVera's Speed-to-Lead Agent rings every website enquiry back in about 20 seconds, qualifies them, and books the job — so you beat the other quote to the phone. From $2,000/mo.",
};

export default function SpeedToLeadPage() {
  return <PackageLanding tier={tier} demo={<SpeedToLeadDemo />} />;
}
