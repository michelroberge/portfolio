"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || process.env.NEXT_PUBLIC_CLIENT_URL || "";

  // Get returnUrl from the query string, default to /admin if not provided
  // const returnUrl = window.location.href;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {isAuthenticated, setIsAuthenticated} = useAuth(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      credentials: "include", // Ensures the auth-token cookie is stored
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      if ( returnUrl){
        router.push(returnUrl);
      }
    } else {
      setError("Invalid credentials");
    }
  };

  useEffect(()=>{
    if ( isAuthenticated && searchParams && searchParams.get("returnUrl")){
      const dest = searchParams.get("returnUrl");
      console.log("should push to ", dest);
    }  
  }, [isAuthenticated]);

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100 space-y-6">
      {/* Traditional Login Form */}
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

      {/* OAuth2 Login Options */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-center">Or Login with</h3>
        <div className="flex flex-col gap-2">
          <Link
            href={`${apiUrl}/api/auth/oauth2/google?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="bg-red-500 text-white text-center py-2 rounded"
          >
            Login with Google
          </Link>
          <Link
            href={`${apiUrl}/api/auth/oauth2/facebook?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="bg-blue-600 text-white text-center py-2 rounded"
          >
            Login with Facebook
          </Link>
          {/* <Link
            href={`${apiUrl}/api/auth/oauth2/github?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="bg-gray-800 text-white text-center py-2 rounded"
          >
            Login with GitHub
          </Link>
          <Link
            href={`${apiUrl}/api/auth/oauth2/microsoft?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="bg-blue-400 text-white text-center py-2 rounded"
          >
            Login with Microsoft
          </Link> */}
        </div>
      </div>
    </div>
  );
}
