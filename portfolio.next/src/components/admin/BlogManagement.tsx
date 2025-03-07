"use client";
import { useState } from "react";
import Link from "next/link";
import { archiveBlog } from "@/services/blogService";
import { BlogEntry } from "@/models/BlogEntry";

export default function BlogManagement({ initialBlogs }: { initialBlogs: BlogEntry[] }) {
  const [blogs, setBlogs] = useState<BlogEntry[]>(initialBlogs);
  const [error, setError] = useState<string | null>(null);

  const handleArchive = async (id: string) => {
    if (!confirm("Are you sure you want to archive this blog post?")) return;

    try {
      await archiveBlog(id);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id)); // ✅ Remove blog from UI
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
