import { API_ENDPOINTS } from "@/lib/constants";

export interface Page{
  _id?: string,
  title: string,
  content: string
}

export async function fetchPage(slug: string, fromCache: boolean = true) {
  const res = await fetch(`${API_ENDPOINTS.page}/slug/${slug}`, fromCache ? {} : { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPages() {
    const res = await fetch(`${API_ENDPOINTS.page}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch pages");
    return await res.json();
  }
  
  export async function createPage(pageData: Page) {
    const res = await fetch(`${API_ENDPOINTS.page}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    if (!res.ok) throw new Error("Failed to create page");
    return await res.json();
  }
  
  export async function updatePage(id: string, pageData: Page) {
    const res = await fetch(`${API_ENDPOINTS.page}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    if (!res.ok) throw new Error("Failed to update page");
    return await res.json();
  }
  
  export async function deletePage(id: string) {
    const res = await fetch(`${API_ENDPOINTS.page}/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) throw new Error("Failed to delete page");
  }
  