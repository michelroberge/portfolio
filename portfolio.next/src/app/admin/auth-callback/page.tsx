"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const returnUrl = searchParams.get("returnUrl") || "/admin";

    if (token) {
      // Set the auth token cookie
      document.cookie = `auth-token=${token}; path=/; max-age=3600; samesite=lax`;
      
      // Redirect to the intended page
      router.push(returnUrl);
    } else {
      // No token, redirect to login with error
      router.push("/admin/login?error=missing_token");
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Completing authentication...</h2>
        <p className="text-gray-600">Please wait while we finish setting up your session.</p>
      </div>
    </div>
  );
}
