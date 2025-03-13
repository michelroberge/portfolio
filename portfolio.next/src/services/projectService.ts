// portfolio.next/src/services/projectService.ts
import { Project, ProjectCreate } from "@/models/Project";
import { PUBLIC_API, ADMIN_API } from "@/lib/constants";

/**
 * Fetch a project by ID
 */
export async function fetchProject(id: string): Promise<Project> {
    try {
        const res = await fetch(PUBLIC_API.project.get(id), {
            credentials: "include", // Include for potential admin access
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to fetch project");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch project:", error);
        throw error;
    }
}

/**
 * Fetch all projects
 */
export async function fetchProjects(): Promise<Project[]> {
    try {
        const res = await fetch(PUBLIC_API.project.list, {
            credentials: "include", // Include for potential admin access
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to fetch projects");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        throw error;
    }
}

/**
 * Create a new project
 */
export async function createProject(projectData: ProjectCreate): Promise<Project> {
    try {
        const res = await fetch(ADMIN_API.project.create, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...projectData,
                status: projectData.status || 'planned',
                technologies: projectData.technologies || []
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to create project");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to create project:", error);
        throw error;
    }
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    try {
        const res = await fetch(ADMIN_API.project.update(id), {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(projectData),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to update project");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to update project:", error);
        throw error;
    }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<void> {
    try {
        const res = await fetch(ADMIN_API.project.delete(id), {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to delete project");
        }
    } catch (error) {
        console.error("Failed to delete project:", error);
        throw error;
    }
}

/**
 * Archive a project
 */
export async function archiveProject(id: string): Promise<void> {
    try {
        const res = await fetch(ADMIN_API.project.archive(id), {
            method: "PUT",
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to archive project");
        }
    } catch (error) {
        console.error("Failed to archive project:", error);
        throw error;
    }
}

/**
 * Search for projects
 */
export async function searchProjects(query: string): Promise<Project[]> {
    try {
        const res = await fetch(PUBLIC_API.project.search(query), {
            credentials: "include", // Include for potential admin access
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to search projects");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to search projects:", error);
        throw error;
    }
}