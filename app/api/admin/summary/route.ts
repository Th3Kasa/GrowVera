import { NextResponse } from "next/server";
import { getSummary } from "@/lib/dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Business summary for the dashboard. Gated by middleware. */
export async function GET() {
  const summary = await getSummary();
  return NextResponse.json(summary);
}
