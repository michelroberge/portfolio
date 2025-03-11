// portfolio.next/src/services/apiService.ts
import { API_ENDPOINTS } from "@/lib/constants";

/**
 * Fetches blog entries from the API.
 * @returns {Promise<any>} - The parsed JSON response.
 */
export async function fetchBlogEntries() {
    const response = await fetch(`${API_ENDPOINTS.blog}`);
    if (!response.ok) {
      throw new Error(`Error fetching blog entries: ${response.statusText}`);
    }
    return response.json();
  }
  
  /**
   * Fetches projects from the API.
   * @returns {Promise<any>} - The parsed JSON response.
   */
  export async function fetchProjects() {
    const response = await fetch(`${API_ENDPOINTS.project}`);
    if (!response.ok) {
      throw new Error(`Error fetching projects: ${response.statusText}`);
    }
    return response.json();
  }
  