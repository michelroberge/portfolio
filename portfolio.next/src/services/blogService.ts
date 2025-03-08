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
        _id: String(data._id), 
        tags: data.tags
      } as BlogEntry;
    } catch (error) {
      console.error("Error fetching blog:", error);
      return null;
    }
  }
  
  export async function getBlogs(): Promise<BlogEntry[]> {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`;
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("Failed to fetch blogs");
  
      return await res.json();
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching blogs");
    }
  }
  
  export async function archiveBlog(id: string) {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`;
      const res = await fetch(`${url}/api/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (!res.ok) throw new Error("Failed to archive blog post");
    } catch (error) {
      console.error(error);
      throw new Error("Error archiving blog");
    }
  }

  export async function updateBlog(id: string, blogData: Partial<BlogEntry>) {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`;
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });
  
      if (!res.ok) throw new Error("Failed to update blog post");
    } catch (error) {
      console.error(error);
      throw new Error("Error updating blog");
    }
  }