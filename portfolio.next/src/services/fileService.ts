import { FileInfo } from '@/models/FileInfo';
import { API_ENDPOINTS } from '@/lib/constants';

export async function fetchFiles(entityId?: string, context?: string): Promise<FileInfo[]> {
  try {
    const url = new URL(`${API_ENDPOINTS.file}`);
    if (entityId && context) {
      url.searchParams.append("entityId", entityId);
      url.searchParams.append("context", context);
    }

    const res = await fetch(url.toString(), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch files");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function uploadFile(file: File, entityId: string, context: string, isPublic: boolean): Promise<FileInfo> {
  try {
    const formData = new FormData();
    formData.append("file", file); 
    formData.append("context", context);
    formData.append("entityId", entityId);
    formData.append("isPublic", isPublic.toString());

    const url = new URL(`${API_ENDPOINTS.file}/upload`);
    url.searchParams.append("entityId", entityId);
    url.searchParams.append("context", context);
    url.searchParams.append("isPublic", isPublic.toString());

    const res = await fetch(url.toString(), {
      method: "POST",
      credentials: "include",
      headers: { "content-type" : "multipart/form-data", "x-filename" : file.name},
      body: formData, 
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  try {
    const res = await fetch(`${API_ENDPOINTS.file}/${fileId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
