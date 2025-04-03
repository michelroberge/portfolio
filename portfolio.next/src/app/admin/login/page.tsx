"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {  APP_ROUTES } from "@/lib/constants";
import { useLoading } from '@/context/LoadingContext';

export default function AdminLogin() {

  const { withLoading } = useLoading();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || APP_ROUTES.admin.home;
  const { isAuthenticated, login, refreshAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await withLoading(
        (async () => {
          await login(email, password);
          await refreshAuth();
          if (returnUrl) {
            router.push(returnUrl);
          }
        })()
      );
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
    <div className="flex min-h-screen flex-col justify-center items-center space-y-6">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          placeholder="Username or email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2 text-gray-800"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 text-gray-800"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>

    </div>
  );
}
