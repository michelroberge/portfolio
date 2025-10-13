import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Only redirect /admin to login if no auth token
  // Server-side protection will handle the rest
  if (req.nextUrl.pathname === "/admin" && !req.cookies.get("auth-token")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
