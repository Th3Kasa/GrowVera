import { NextRequest, NextResponse } from "next/server";
import { listRecords, isConfigured, AIRTABLE, escapeFormulaValue } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (!isConfigured()) {
    return new NextResponse("Demo service unavailable", { status: 503 });
  }

  const recs = await listRecords<{ DemoHtml?: string }>(AIRTABLE.tables.leads(), {
    filterByFormula: `{LeadId} = '${escapeFormulaValue(id)}'`,
    maxRecords: 1,
    fields: ["DemoHtml"],
  });

  const html = recs[0]?.fields?.DemoHtml;
  if (!html) {
    return new NextResponse("Demo not found", { status: 404 });
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "no-store",
    },
  });
}
