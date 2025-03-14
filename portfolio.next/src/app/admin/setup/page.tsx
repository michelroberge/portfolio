"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/lib/constants";
import { AdminInitRequest } from "@/models/AdminInit";
import { checkAdminExists, initializeAdmin } from "@/services/adminService";

export default function AdminSetup() {
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      try {
        const data = await checkAdminExists();
        setAdminExists(data.exists);
        
        if (data.exists) {
          console.log("Admin already exists");
          router.push(APP_ROUTES.admin.home);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to check admin status");
        }
      }
    }
    checkAdmin();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const initRequest: AdminInitRequest = {
        username,
        password,
        isAdmin: true,
      };

      await initializeAdmin(initRequest);
      router.push(APP_ROUTES.auth.login);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create admin account");
      }
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
