// portfolio.next/src/services/blogService.ts

import { API_ENDPOINTS } from "@/lib/constants";
import { BlogEntry, BaseBlogEntry } from "@/models/BlogEntry";

/**
 * Fetches all blog entries
 */
export async function fetchBlogEntries(): Promise<BlogEntry[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.admin.blogs}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blog entries");
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
    const response = await fetch(`${API_ENDPOINTS.blog}/${id}`, {
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
export async function createBlogEntry(blog: Omit<BlogEntry, '_id' | 'createdAt' | 'updatedAt'>): Promise<BlogEntry> {
  try {
    const response = await fetch(`${API_ENDPOINTS.admin.blogs}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(blog),
    });

    if (!response.ok) {
      throw new Error("Failed to create blog entry");
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
export async function updateBlogEntry(id: string, blog: Partial<BaseBlogEntry>): Promise<BaseBlogEntry> {
  try {
    const response = await fetch(`${API_ENDPOINTS.admin.blogs}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(blog),
    });

    if (!response.ok) {
      throw new Error("Failed to update blog entry");
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
    const response = await fetch(`${API_ENDPOINTS.admin.blogs}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete blog entry");
    }
  } catch (err) {
    console.error("Failed to delete blog entry:", err);
    throw err;
  }
}