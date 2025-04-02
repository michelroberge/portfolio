// portfolio.next/src/services/projectService.ts
import { Project, ProjectCreate } from "@/models/Project";
import { PUBLIC_API, ADMIN_API } from "@/lib/constants";

/**
 * Fetch a project by ID
 * 
 * Uses the admin endpoint when isAdmin is true, allowing admins to view
 * draft/unpublished projects that aren't visible to public users.
 */
export async function fetchProject(id: string, isAdmin: boolean = false, cookieHeader: string | null = null): Promise<Project> {
    try {
        const url = isAdmin ? ADMIN_API.project.get(id) : PUBLIC_API.project.get(id);
        
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } // Pass cookies for SSR requests
            : {};

        const res = await fetch(url, {
            credentials: "include",
            headers,
            cache: "no-store",
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
 * 
 * Uses the admin endpoint when isAdmin is true, allowing admins to view
 * draft/unpublished projects that aren't visible to public users.
 */
export async function fetchProjects(isAdmin: boolean = false, cookieHeader: string | null = null): Promise<Project[]> {
    try {
        const url = isAdmin ? ADMIN_API.project.list : PUBLIC_API.project.list;
        
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } // Pass cookies for SSR requests
            : {};

        const res = await fetch(url, {
            credentials: "include",
            headers,
            cache: "no-store",
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
export async function createProject(projectData: ProjectCreate, cookieHeader: string | null = null): Promise<Project> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const res = await fetch(ADMIN_API.project.create, {
            method: "POST",
            credentials: "include",
            headers,
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
export async function updateProject(id: string, projectData: Partial<Project>, cookieHeader: string | null = null): Promise<Project> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const res = await fetch(ADMIN_API.project.update(id), {
            method: "PUT",
            credentials: "include",
            headers,
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
export async function deleteProject(id: string, cookieHeader: string | null = null): Promise<void> {
    try {
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader }
            : {};

        const res = await fetch(ADMIN_API.project.delete(id), {
            method: "DELETE",
            credentials: "include",
            headers,
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
export async function archiveProject(id: string, cookieHeader: string | null = null): Promise<void> {
    try {
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader }
            : {};

        const res = await fetch(ADMIN_API.project.archive(id), {
            method: "PUT",
            credentials: "include",
            headers,
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
export async function searchProjects(query: string, cookieHeader: string | null = null): Promise<Project[]> {
    try {
        // For search operations, we only have PUBLIC_API endpoints
        const url = PUBLIC_API.project.search(query);
        
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader }
            : {};

        const res = await fetch(url, {
            credentials: "include",
            headers,
            cache: "no-store",
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