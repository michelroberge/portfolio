"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EditProject() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${apiUrl}/api/auth/check`, { credentials: "include" });
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setAuthenticated(true);
        }
      } catch {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  // Fetch project details once authenticated
  useEffect(() => {
    if (!authenticated) return;
    async function fetchProject() {
      try {
        const response = await fetch(`${apiUrl}/api/projects/${id}`);
        if (!response.ok) throw new Error("Failed to fetch project");
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setImage(data.image);
        setLink(data.link);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }
    fetchProject();
  }, [authenticated, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = { title, description, image, link };
    try {
      const response = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error("Failed to update project");
      router.push("/admin/projects");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!authenticated) return <p>Checking authentication...</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
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
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Save Changes
        </button>
      </form>
    </>
  );
}
