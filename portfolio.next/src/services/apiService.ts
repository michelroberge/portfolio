// portfolio.next/src/services/apiService.ts

/**
 * Fetches blog entries from the API.
 * @returns {Promise<any>} - The parsed JSON response.
 */
export async function fetchBlogEntries() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
    if (!response.ok) {
      throw new Error(`Error fetching projects: ${response.statusText}`);
    }
    return response.json();
  }
  