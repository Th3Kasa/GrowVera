import { redirect } from "next/navigation";

// Retired personalised website-offer flow — redirect to the AI Audit funnel until the pipeline is repurposed for AI-agent offers.
export default function OfferRedirect() {
  redirect("/audit");
}
