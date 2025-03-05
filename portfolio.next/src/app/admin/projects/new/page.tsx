// portfolio.next/src/app/admin/projects/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function NewProject() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [publishAt, setPublishAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [industry, setIndustry] = useState("General");
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = { title, excerpt, description, image, link, isDraft, publishAt, tags, industry };
    try {
      const response = await fetch(`${apiUrl}/api/projects`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error("Failed to create project");
      router.push("/admin/projects");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!isAuthenticated) return <p>You are not authenticated.</p>;
  if (!user?.isAdmin) return <p>Only admins can access this page.</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Project Title"
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
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded h-32"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Project Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border rounded"
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

        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full p-2 border rounded">
          <option>General</option>
          <option>Healthcare</option>
          <option>Finance</option>
          <option>Education</option>
        </select>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Create Project
        </button>
      </form>
    </>
  );
}
