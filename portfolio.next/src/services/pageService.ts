import { API_ENDPOINTS } from "@/lib/constants";
import { Page, BasePage } from "@/models/Page";

export async function fetchPage(slug: string): Promise<Page | null> {
  try {
    const res = await fetch(`${API_ENDPOINTS.page}/slug/${slug}`, { credentials: "include" });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error('Failed to fetch page:', err);
    return null;
  }
}

export async function fetchPages(): Promise<Page[]> {
  try {
    const res = await fetch(`${API_ENDPOINTS.page}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch pages");
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch pages:', err);
    throw err;
  }
}

export async function createPage(pageData: BasePage): Promise<Page> {
  try {
    const res = await fetch(`${API_ENDPOINTS.page}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    if (!res.ok) throw new Error("Failed to create page");
    return await res.json();
  } catch (err) {
    console.error('Failed to create page:', err);
    throw err;
  }
}

export async function updatePage(id: string, pageData: Partial<BasePage>): Promise<Page> {
  try {
    const res = await fetch(`${API_ENDPOINTS.page}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    if (!res.ok) throw new Error("Failed to update page");
    return await res.json();
  } catch (err) {
    console.error('Failed to update page:', err);
    throw err;
  }
}

export async function deletePage(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_ENDPOINTS.page}/${id}`, { 
      method: "DELETE", 
      credentials: "include" 
    });
    if (!res.ok) throw new Error("Failed to delete page");
  } catch (err) {
    console.error('Failed to delete page:', err);
    throw err;
  }
}