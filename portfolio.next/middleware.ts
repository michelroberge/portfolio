import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Example: Redirect users trying to access /admin if not authenticated
  const authToken = req.cookies.get("auth-token")?.value;
  if (!authToken && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Define which routes should trigger this middleware
};
