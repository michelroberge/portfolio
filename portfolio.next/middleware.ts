import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Skip middleware for login page, auth callback, and static files
  if (req.nextUrl.pathname === "/admin/login" || 
      req.nextUrl.pathname === "/admin/auth-callback" ||
      req.nextUrl.pathname.startsWith("/_next") ||
      req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if user is accessing admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const authToken = req.cookies.get("auth-token")?.value;
    
    if (!authToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Verify token with backend
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/auth/status`, {
        headers: {
          Cookie: `auth-token=${authToken}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        // Token is invalid, redirect to login
        const response = NextResponse.redirect(new URL("/admin/login", req.url));
        response.cookies.delete("auth-token");
        return response;
      }

      const data = await response.json();
      if (!data.authenticated || !data.user?.isAdmin) {
        // User is not authenticated or not admin
        const response = NextResponse.redirect(new URL("/admin/login", req.url));
        response.cookies.delete("auth-token");
        return response;
      }

      // User is authenticated and is admin, allow access
      return NextResponse.next();
    } catch (error) {
      console.error('Auth verification failed:', error);
      // On error, redirect to login
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
