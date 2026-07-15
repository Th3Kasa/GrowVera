import type { Metadata } from "next";
import PackageLanding from "@/components/PackageLanding";
import SpeedToLeadDemo from "@/components/demo/SpeedToLeadDemo";
import { getTierBySlug } from "@/lib/tiers";

const tier = getTierBySlug("speed-to-lead")!;

export const metadata: Metadata = {
  title: "Speed-to-Lead Agent — call every web lead back in 20 seconds | GrowVera",
  description:
    "GrowVera's Speed-to-Lead Agent rings every website enquiry back in about 20 seconds — before the other quote even sees it. It qualifies the lead and books the job. From $2,000/mo + one-off setup.",
};

export default function SpeedToLeadPage() {
  return <PackageLanding tier={tier} demo={<SpeedToLeadDemo />} />;
}
