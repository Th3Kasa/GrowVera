import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, makeToken, passwordOk } from "@/lib/auth";

export const runtime = "nodejs";

/** Exchange the admin password for a signed httpOnly cookie. */
export async function POST(request: NextRequest) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const password = String(body.password ?? "");
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin not configured. Set ADMIN_PASSWORD." }, { status: 500 });
  }
  if (!(await passwordOk(password))) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await makeToken(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
