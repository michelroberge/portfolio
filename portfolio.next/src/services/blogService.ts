// portfolio.next/src/services/blogService.ts
export interface BlogEntry {
    _id: number;
    title: string;
    publishAt: string;
    body: string;
    excerpt?: string;
    link: string;
  }
  
  /**
   * Fetches a single blog entry by its ID.
   * @param id - The blog entry identifier.
   * @returns A BlogEntry object if successful, or null otherwise.
   */
  export async function getBlog(id: string): Promise<BlogEntry | null> {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const data: BlogEntry = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching blog:", error);
      return null;
    }
  }
  