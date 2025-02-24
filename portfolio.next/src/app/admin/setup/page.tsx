// portfolio.next/src/app/admin/setup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminSetup() {
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch(`${apiUrl}/api/users/admin-exists`, {
          credentials: "include",
        });
        const data = await res.json();
        setAdminExists(data.exists);
        if (data.exists) {
          // If an admin exists, redirect to the admin dashboard.
          router.push("/admin");
        }
      } catch (err: any) {
        setError("Error checking admin status");
      }
    }
    checkAdmin();
  }, [apiUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Use our existing user registration endpoint to create an admin.
      const res = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, isAdmin: true }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Admin creation failed");
      }
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (adminExists === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Setup</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Admin Account
        </button>
      </form>
    </div>
  );
}
