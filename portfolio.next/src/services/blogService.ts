// portfolio.next/src/services/blogService.ts

import { BlogEntry, BlogEntryCreate, BlogEntryUpdate } from "@/models/BlogEntry";
import { PUBLIC_API, ADMIN_API } from "@/lib/constants";

/**
 * Fetches all blog entries
 */
export async function fetchBlogEntries(): Promise<BlogEntry[]> {
  try {
    const response = await fetch(PUBLIC_API.blog.list, {
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch blog entries");
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to fetch blog entries:", err);
    throw err;
  }
}

/**
 * Fetches a single blog entry by ID
 */
export async function fetchBlogEntry(id: string): Promise<BlogEntry> {
  try {
    const response = await fetch(PUBLIC_API.blog.get(id), {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blog entry");
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to fetch blog entry:", err);
    throw err;
  }
}

/**
 * Creates a new blog entry
 */
export async function createBlogEntry(blog: BlogEntryCreate): Promise<BlogEntry> {
  try {
    const response = await fetch(ADMIN_API.blog.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(blog),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create blog entry");
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to create blog entry:", err);
    throw err;
  }
}

/**
 * Updates an existing blog entry
 */
export async function updateBlogEntry(id: string, blog: BlogEntryUpdate): Promise<BlogEntry> {
  try {
    const response = await fetch(ADMIN_API.blog.update(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(blog),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update blog entry");
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to update blog entry:", err);
    throw err;
  }
}

/**
 * Deletes a blog entry
 */
export async function deleteBlogEntry(id: string): Promise<void> {
  try {
    const response = await fetch(ADMIN_API.blog.delete(id), {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete blog entry");
    }
  } catch (err) {
    console.error("Failed to delete blog entry:", err);
    throw err;
  }
}