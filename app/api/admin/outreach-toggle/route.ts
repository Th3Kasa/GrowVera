import { NextRequest, NextResponse } from "next/server";
import { setOutreachEnabled, isOutreachEnabled } from "@/lib/settings";

export const runtime = "nodejs";

/** Flip the autonomous-outreach kill switch. Gated by middleware. */
export async function POST(request: NextRequest) {
  let body: { enabled?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  await setOutreachEnabled(!!body.enabled);
  return NextResponse.json({ ok: true, enabled: await isOutreachEnabled() });
}
