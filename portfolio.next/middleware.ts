import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Don't redirect /admin - let server-side protection handle it
  // This prevents loops when coming from OIDC callback
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
