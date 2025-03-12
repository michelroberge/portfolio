"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/constants";

export default function NewBlogEntry() {
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [publishAt, setPublishAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const blogData = { title, excerpt, body, isDraft, publishAt };

    try {
      const response = await fetch(`${API_ENDPOINTS.admin.blogs}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) throw new Error("Failed to create blog post");

      router.push("/admin/blogs");
    } catch (err: unknown) { 
      if (err instanceof Error) {
        setError((err as Error).message);
      }
    }
  };

  if (!isAuthenticated) return <p>You are not authenticated.</p>;
  if (!(user?.isAdmin)) return <p>Only admins can access this page.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Blog Entry</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Body (Markdown supported)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 border rounded h-40"
          required
        />
        <label className="block">
          <input
            type="checkbox"
            checked={isDraft}
            onChange={(e) => setIsDraft(e.target.checked)}
            className="mr-2"
          />
          Save as Draft
        </label>
        <label className="block">
          Publish Date:
          <input
            type="date"
            onChange={(e) => setPublishAt(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
}
