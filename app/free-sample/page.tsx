import { redirect } from "next/navigation";

// The old "free sample website" offer is retired in the AI-agents reposition.
// The new entry product is the Free AI Audit — send any old inbound links there.
export default function FreeSampleRedirect() {
  redirect("/audit");
}
