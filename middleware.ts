import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, tokenValid } from "@/lib/auth";

/**
 * Gate /admin and /api/admin behind the admin cookie. The login page and the
 * login API are public so the founder can sign in. Everything else under those
 * paths requires a valid cookie (validated against ADMIN_PASSWORD).
 */
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public: the login page and the login endpoint.
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await tokenValid(token)) {
    return NextResponse.next();
  }

  // API → 401 JSON; pages → redirect to login.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}
