"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { APP_ROUTES, REMOTE_URL } from "@/lib/constants";

export default function OIDCLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || APP_ROUTES.admin.home;

  const handleOIDCLogin = () => {
    // Redirect to backend OIDC login endpoint
    window.location.href = `${REMOTE_URL}/api/auth/oidc/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  return (
    <button
      onClick={handleOIDCLogin}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded w-full mb-4 flex items-center justify-center space-x-2"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span>Login with OIDC</span>
    </button>
  );
} 