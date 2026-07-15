import { redirect } from "next/navigation";

// Old "Engine" content package retired in the AI-agents reposition.
// Permanently redirect to the closest new product (the Speed-to-Lead Agent).
export default function EngineRedirect() {
  redirect("/speed-to-lead");
}
