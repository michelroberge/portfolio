"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication on mount.
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
  }, []);

  // Fetch projects once authenticated.
  useEffect(() => {
    if (!authenticated) return;
    async function fetchProjects() {
      try {
        const response = await fetch(`${apiUrl}/api/projects`);
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    fetchProjects();
  }, [authenticated]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const response = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!authenticated) return <p>Checking authentication...</p>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/projects/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add New Project
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2 text-left">Title</th>
            <th className="border border-gray-300 p-2 text-left">Description</th>
            <th className="border border-gray-300 p-2 text-left">Image</th>
            <th className="border border-gray-300 p-2 text-left">Link</th>
            <th className="border border-gray-300 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id} className="border border-gray-300">
              <td className="border border-gray-300 p-2">{project.title}</td>
              <td className="border border-gray-300 p-2">{project.description}</td>
              <td className="border border-gray-300 p-2">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-16 w-auto object-contain"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View
                </a>
              </td>
              <td className="border border-gray-300 p-2">
                <Link
                  href={`/admin/projects/edit/${project._id}`}
                  className="text-blue-500 hover:underline mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
