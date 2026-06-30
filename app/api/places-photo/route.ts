import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Proxies Google Places photo media server-side so GOOGLE_PLACES_API_KEY never
 * reaches the browser. Demo sites reference /api/places-photo?name=... instead
 * of the raw places.googleapis.com URL (which embeds the key in the query string).
 */
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const width = req.nextUrl.searchParams.get("w") || "1200";

  // Only ever proxy Google's own Places photo resource names — never an
  // arbitrary caller-supplied URL (SSRF guard).
  if (!name || !/^places\/[\w-]+\/photos\/[\w-]+$/.test(name)) {
    return new NextResponse("Invalid photo reference", { status: 400 });
  }

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    return new NextResponse("Photo service unavailable", { status: 503 });
  }

  const upstream = await fetch(
    `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${encodeURIComponent(width)}&key=${key}`,
  );

  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Photo not found", { status: 404 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
