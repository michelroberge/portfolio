"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { marked } from "marked";
import { useAuth } from "@/context/AuthContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EditBlogEntry() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [publishAt, setPublishAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit"); // Tab state
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchBlog() {
      try {
        const response = await fetch(`${apiUrl}/api/blogs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch blog post");
        const data = await response.json();

        setTitle(data.title);
        setExcerpt(data.excerpt);
        setBody(data.body);
        setIsDraft(data.isDraft);
        setPublishAt(data.publishAt ? new Date(data.publishAt).toISOString().split("T")[0] : null);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchBlog();
  }, [isAuthenticated, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = { title, excerpt, body, isDraft, publishAt };

    try {
      const response = await fetch(`${apiUrl}/api/blogs/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) throw new Error("Failed to update blog post");
      router.push("/admin/blogs");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!isAuthenticated) return <p>Checking authentication...</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Edit Blog Entry</h1>
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

        {/* Tab Selector */}
        <div className="flex border-b mb-2">
          <button
            type="button"
            className={`p-2 ${activeTab === "edit" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
            onClick={() => setActiveTab("edit")}
          >
            Edit
          </button>
          <button
            type="button"
            className={`p-2 ${activeTab === "preview" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>

        {/* Markdown Editor / Preview */}
        {activeTab === "edit" ? (
          <textarea
            placeholder="Body (Markdown supported)"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded h-40"
            required
          />
        ) : (
          <div
            className="w-full p-2 border rounded h-40 bg-gray-100 overflow-auto prose max-w-none"
            dangerouslySetInnerHTML={{ __html: marked.parse(body) }}
          />
        )}

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
            value={publishAt || ""}
            onChange={(e) => setPublishAt(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Save Changes
        </button>
      </form>
    </>
  );
}
