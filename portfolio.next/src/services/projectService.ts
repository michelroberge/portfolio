// portfolio.next/src/services/projectService.ts
import { Project, ProjectCreate } from "@/models/Project";
import { API_ENDPOINTS } from "@/lib/constants";

/**
 * Fetches a single project entry by its ID.
 * @param id - The project identifier.
 * @returns A Project object if successful, or null otherwise.
 */
export async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`${API_ENDPOINTS.project}/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch project");
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch project:', err);
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(API_ENDPOINTS.project, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch projects");
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    return [];
  }
}

export async function createProject(projectData: ProjectCreate): Promise<Project> {
  try {
    const res = await fetch(API_ENDPOINTS.project, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...projectData,
        status: projectData.status || 'planned',
        technologies: projectData.technologies || []
      }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to create project");
    return await res.json();
  } catch (err) {
    console.error('Failed to create project:', err);
    throw err;
  }
}

export async function updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
  try {
    const res = await fetch(`${API_ENDPOINTS.project}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to update project");
    return await res.json();
  } catch (err) {
    console.error('Failed to update project:', err);
    throw err;
  }
}

export async function archiveProject(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_ENDPOINTS.project}/${id}/archive`, {
      method: "PUT",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to archive project");
  } catch (err) {
    console.error('Failed to archive project:', err);
    throw err;
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_ENDPOINTS.project}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete project");
  } catch (err) {
    console.error('Failed to delete project:', err);
    throw err;
  }
}