import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "merchops_user_id";

const protectedPrefixes = [
  "/dashboard",
  "/orders",
  "/inbox",
  "/inventory",
  "/couriers",
  "/analytics",
  "/audit",
  "/settings",
  "/print",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!needsAuth) return NextResponse.next();

  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/inbox/:path*",
    "/inventory/:path*",
    "/couriers/:path*",
    "/analytics/:path*",
    "/audit/:path*",
    "/settings/:path*",
    "/print/:path*",
  ],
};
