"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  // Use the environment variable for API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      credentials: "include", // Ensure the auth-token cookie is stored
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

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
            href={`${apiUrl}/api/auth/oauth2/google`}
            className="bg-red-500 text-white text-center py-2 rounded"
          >
            Login with Google
          </Link>
          <Link
            href={`${apiUrl}/api/auth/oauth2/facebook`}
            className="bg-blue-600 text-white text-center py-2 rounded"
          >
            Login with Facebook
          </Link>
          <Link
            href={`${apiUrl}/api/auth/oauth2/github`}
            className="bg-gray-800 text-white text-center py-2 rounded"
          >
            Login with GitHub
          </Link>
          <Link
            href={`${apiUrl}/api/auth/oauth2/microsoft`}
            className="bg-blue-400 text-white text-center py-2 rounded"
          >
            Login with Microsoft
          </Link>
        </div>
      </div>
    </div>
  );
}
