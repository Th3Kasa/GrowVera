import { redirect } from "next/navigation";

// Old "Presence" marketing package retired in the AI-agents reposition.
// Permanently redirect to the closest new product (the AI Receptionist).
export default function PresenceRedirect() {
  redirect("/receptionist");
}
