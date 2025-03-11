// portfolio.next/src/services/projectService.ts
import { Project } from "@/models/Project";
import { API_ENDPOINTS } from "@/lib/constants";

  /**
   * Fetches a single project entry by its ID.
   * @param id - The project  identifier.
   * @returns A Project object if successful, or null otherwise.
   */
  export async function getProject(id: string): Promise<Project | null> {
    try {
      const url = `${API_ENDPOINTS.project}/${id}`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const data: Project = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching project:", error);
      return null;
    }
  }
  