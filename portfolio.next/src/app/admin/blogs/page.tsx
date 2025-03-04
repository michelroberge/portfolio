"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface BlogEntry {
  _id: string;
  title: string;
  excerpt: string;
  isDraft: boolean;
  publishAt?: string;
}

const apiUrl :string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogManagement() {

  const [blogs, setBlogs] = useState<BlogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchBlogs() {
      try {
        const response = await fetch(`${apiUrl}/api/blogs`, {credentials: "include"});
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogs(data);
      } catch (err: unknown) { 
        if (err instanceof Error) {
          setError((err as Error).message);
        }
      }
    }
    fetchBlogs();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <p>You are not authenticated.</p>;
  if (!user?.isAdmin) return <p>Only admins can access this page.</p>;

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this blog post?")) return;

    try {
      const response = await fetch(`${apiUrl}/api/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to archive the blog post");

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Blog Posts</h1>

      <div className="flex justify-end mb-4">
        <Link
          href="/admin/blogs/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add New Blog
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2 text-left">Title</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="border border-gray-300">
              <td className="border border-gray-300 p-2">{blog.title}</td>
              <td className="border border-gray-300 p-2">
                {blog.isDraft ? "Draft" : "Published"}
                {blog.publishAt ? ` (Scheduled: ${new Date(blog.publishAt).toLocaleDateString()})` : ""}
              </td>
              <td className="border border-gray-300 p-2">
                <Link
                  href={`/admin/blogs/edit/${blog._id}`}
                  className="text-blue-500 hover:underline mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleArchive(blog._id)}
                  className="text-red-500 hover:underline"
                >
                  Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
