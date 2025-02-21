"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("http://localhost:5000/api/auth/check", {
        credentials: "include",
      });

      if (res.ok) {
        setAuthenticated(true);
      } else {
        router.push("/admin/login");
      }
    }

    checkAuth();
  }, []);

  if (!authenticated) return <p>You are not authenticated.</p>;

  return (
    <>
    <Header />
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6">Welcome to the admin panel! You can now manage your blog and projects.</p>

      <div className="flex gap-4">
        {/* New Blog Entry Button */}
        <button
          onClick={() => router.push("/admin/blog/new")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          New Blog Entry
        </button>

        {/* New Project Button */}
        <button
          onClick={() => router.push("/admin/projects/new")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          New Project
        </button>

        {/* Logout Button */}
        <a
          href="http://localhost:5000/api/auth/logout"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Logout
        </a>
      </div>
    </div>
    </>
  );
}
