"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) return <p>You are not authenticated.</p>;
  if (!user?.isAdmin) return <p>Only admins can access this page.</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-semibold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome to the admin panel. Use the options below to manage your site.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/blogs"
          className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-medium text-gray-800">Manage Blogs</h2>
          <p className="text-sm text-gray-500">Edit, create, and manage blog posts</p>
        </Link>
        <Link
          href="/admin/projects"
          className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-medium text-gray-800">Manage Projects</h2>
          <p className="text-sm text-gray-500">Edit, create, and manage projects</p>
        </Link>
        <Link
          href="/admin/comments"
          className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-medium text-gray-800">Manage Comments</h2>
          <p className="text-sm text-gray-500">Review and moderate user comments</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-medium text-gray-800">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">View site metrics and performance data</p>
        </Link>
        <Link
          href="/admin/settings/provider-config"
          className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="text-lg font-medium text-gray-800">OAuth Provider Config</h2>
          <p className="text-sm text-gray-500">Configure external identity providers</p>
        </Link>
      </div>
    </div>
  );
}
