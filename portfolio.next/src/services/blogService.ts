// portfolio.next/src/services/blogService.ts
import { BlogEntry } from "@/models/BlogEntry";
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
      return {
        ...data,
        _id: String(data._id), // Ensure `_id` is always a string
      } as BlogEntry;
    } catch (error) {
      console.error("Error fetching blog:", error);
      return null;
    }
  }
  