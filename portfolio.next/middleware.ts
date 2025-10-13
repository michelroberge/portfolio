import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Simple middleware: just redirect /admin to /admin/login if no auth token
  // Let the existing server-side protection handle the real authentication
  if (req.nextUrl.pathname === "/admin" && !req.cookies.get("auth-token")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
