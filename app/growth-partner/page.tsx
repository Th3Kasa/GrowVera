import { redirect } from "next/navigation";

// Old "Growth Partner" ads package retired in the AI-agents reposition.
// Permanently redirect to the flagship new product (the AI Quoting Agent).
export default function GrowthPartnerRedirect() {
  redirect("/quoting");
}
