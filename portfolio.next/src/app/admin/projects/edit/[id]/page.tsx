// portfolio.next/src/app/admin/projects/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Project } from "@/models/Project";
import EditProject from "@/components/admin/EditProject";
import { getProject } from "@/services/projectService";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    
    async function loadProject(id: string) {
      try {
        const data = await getProject(id);
        if (!data) throw new Error('Project not found');
        setProject(data);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('Failed to load project');
      }
    }

    if (params.id) {
      loadProject(params.id);
    }
  }, [params.id, isAuthenticated]);

  if (!isAuthenticated || !(user?.isAdmin)) {
    router.push('/auth/login');
    return null;
  }

  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Loading...</div>;

  return <EditProject initialProject={project} />;
}
