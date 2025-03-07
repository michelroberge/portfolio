const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchPages() {
    const res = await fetch(`${apiUrl}/api/pages`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch pages");
    return await res.json();
  }
  
  export async function fetchPage(slug: string) {
    const res = await fetch(`${apiUrl}/api/pages/${slug}`);
    if (!res.ok) throw new Error("Page not found");
    return await res.json();
  }
  
  export async function createPage(pageData: any) {
    const res = await fetch(`${apiUrl}/api/pages`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    if (!res.ok) throw new Error("Failed to create page");
    return await res.json();
  }
  
  export async function updatePage(id: string, pageData: any) {
    const res = await fetch(`${apiUrl}/api/pages/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });
    if (!res.ok) throw new Error("Failed to update page");
    return await res.json();
  }
  
  export async function deletePage(id: string) {
    const res = await fetch(`${apiUrl}/api/pages/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) throw new Error("Failed to delete page");
  }
  