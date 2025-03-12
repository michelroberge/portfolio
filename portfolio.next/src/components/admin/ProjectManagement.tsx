import { Project } from '@/models/Project';
import { useState, useEffect } from 'react';
import { archiveProject, getProjects } from '@/services/projectService';
import Link from 'next/link';

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Following memory rule: Components should handle their own data fetching
  useEffect(() => {
    refreshProjects();
  }, []);


  async function handleArchive(id: string) {
    try {
      await archiveProject(id);
      setProjects(projects.filter(project => project._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to archive project');
    }
  }

  async function refreshProjects() {
    try {
      setLoading(true);
      const updatedProjects = await getProjects();
      setProjects(updatedProjects);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to refresh projects');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <div className="space-x-4">
          <Link 
            href="/admin/projects/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            New Project
          </Link>
          <button
            onClick={refreshProjects}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((project) => (
          <div 
            key={project._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-500">
                Status: {project.status} • 
                {project.startDate && `Started: ${new Date(project.startDate).toLocaleDateString()}`}
              </p>
              {project.technologies.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {project.technologies.map(tech => (
                    <span 
                      key={tech}
                      className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Link
                href={`/admin/projects/edit/${project._id}`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleArchive(project._id)}
                className="text-red-500 hover:underline"
              >
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
