"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) return <p>You are not authenticated.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6">
        Welcome to the admin panel! Use the navigation below to manage your site.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/blogs"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Manage Blogs
        </Link>
        <Link
          href="/admin/projects"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Manage Projects
        </Link>
        <Link
          href="/admin/comments"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Manage Comments
        </Link>
        <Link
          href="/admin/analytics"
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Analytics Dashboard
        </Link>
        <Link
          href="/admin/settings/provider-config"
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          OAuth Provider Config
        </Link>
        <a
          href={`${apiUrl}/api/auth/logout`}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Logout
        </a>
      </div>
    </div>
  );
}
