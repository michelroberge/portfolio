import { API_ENDPOINTS } from "@/lib/constants";
export async function fetchFiles(entityId?: string, context?: string) {
    const url = new URL(`${API_ENDPOINTS.file}`);
    if (entityId && context) {
      url.searchParams.append("entityId", entityId);
      url.searchParams.append("context", context);
    }
  
    try {
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch files");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  

  export async function uploadFile(file: File, entityId: string, context: string, isPublic: boolean) {
    const formData = new FormData();
    formData.append("file", file); // Send raw file data
  
    const url = new URL(`${API_ENDPOINTS.file}/upload`);
    url.searchParams.append("entityId", entityId);
    url.searchParams.append("context", context);
    url.searchParams.append("isPublic", isPublic.toString());
  
    try {
      const res = await fetch(url.toString(), {
        method: "POST",
        credentials: "include",
        // headers: { "X-Filename": file.name }, // File name in headers
        headers: { "content-type" : "multipart/form-data", "x-filename" : file.name},
        body: file, // Send file directly as the request body
      });
  
      if (!res.ok) throw new Error("Upload failed");
      return await res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  export async function deleteFile(fileId: string): Promise<void> {
    const res = await fetch(`${API_ENDPOINTS.file}/${fileId}`, {
      method: "DELETE",
      credentials: "include",
    });
  
    if (!res.ok) {
      throw new Error("Failed to delete");
    }
  }
  
