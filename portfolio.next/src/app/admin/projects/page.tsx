"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Project } from "@/models/Project";
import { getProjects } from "@/services/projectService";

export default function ProjectManagementPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects');
      }
    }

    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !(user?.isAdmin)) {
    router.push('/auth/login');
    return null;
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <button
          onClick={() => router.push('/admin/projects/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-2">{project.excerpt}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{project.isDraft ? 'Draft' : 'Published'}</span>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              <div className="flex-grow"></div>
              <button
                onClick={() => router.push(`/admin/projects/edit/${project._id}`)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
