"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/constants";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin";
  const { isAuthenticated, login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      if (returnUrl) {
        router.push(returnUrl);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials");
    }
  };

  useEffect(() => {
    if (isAuthenticated && returnUrl) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, returnUrl, router]);

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 space-y-6">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          placeholder="Username or email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-center">Or Login with</h3>
        <div className="flex flex-col gap-2">
          <Link
            href={`${API_ENDPOINTS.auth}/oauth2/google?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="bg-red-500 text-white text-center py-2 rounded"
          >
            Login with Google
          </Link>
          <Link
            href={`${API_ENDPOINTS.auth}/oauth2/facebook?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="bg-blue-600 text-white text-center py-2 rounded"
          >
            Login with Facebook
          </Link>
        </div>
      </div>
    </div>
  );
}
