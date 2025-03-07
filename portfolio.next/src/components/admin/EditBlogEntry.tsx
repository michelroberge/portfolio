"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBlog } from "@/services/blogService";
import { marked } from "marked";
import { BlogEntry } from "@/models/BlogEntry";
import FileWrapper from "./FileWrapper";

export default function EditBlogEntry({ initialBlog }: { initialBlog: BlogEntry }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialBlog.title);
  const [excerpt, setExcerpt] = useState(initialBlog.excerpt);
  const [body, setBody] = useState(initialBlog.body);
  const [isDraft, setIsDraft] = useState(initialBlog.isDraft);
  const [tags, setTags] = useState<string[]>(initialBlog.tags);
  const [publishAt, setPublishAt] = useState<string | null>(
    initialBlog.publishAt ? new Date(initialBlog.publishAt).toISOString().split("T")[0] : "null"
  );
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = { title, excerpt, body, isDraft, publishAt, tags };

    try {
      await updateBlog(initialBlog._id, blogData);
      router.push("/admin/blogs"); // ✅ Redirect to blog list after update
    } catch (err) {
      setError((err as Error).message);
    }
  };

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

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags.join(", ")}
          onChange={(e) => setTags(e.target.value.split(",").map((t) => t.trim()))}
          className="w-full p-2 border rounded"
        />


        { initialBlog._id && <FileWrapper entityId={initialBlog._id} context="blog" /> }
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Save Changes
        </button>
      </form>
    </>
  );
}
