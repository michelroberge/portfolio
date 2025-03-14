import { PUBLIC_API, ADMIN_API } from '@/lib/constants';
import { FileInfo } from '@/models/FileInfo';

/**
 * Fetch files with optional filtering
 */
export async function fetchFiles(entityId?: string, context?: string, isAdmin: boolean = false, cookieHeader: string | null = null): Promise<FileInfo[]> {
    try {
        const url = isAdmin ? new URL(ADMIN_API.file.list) : new URL(PUBLIC_API.file.list);
        if (entityId) url.searchParams.append("entityId", entityId);
        if (context) url.searchParams.append("context", context);

        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader }
            : {};

        const res = await fetch(url.toString(), {
            credentials: "include",
            headers,
            cache: "no-store",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to fetch files");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch files:", error);
        throw error;
    }
}

/**
 * Upload a file with metadata
 */
export async function uploadFile(
    file: File,
    entityId: string,
    context: string,
    isPublic: boolean = false,
    isAdmin: boolean = false,
    cookieHeader: string | null = null
): Promise<FileInfo> {
    try {
        if (!isAdmin) {
            throw new Error("Unauthorized");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("entityId", entityId);
        formData.append("context", context);
        formData.append("isPublic", isPublic.toString());

        const url = new URL(ADMIN_API.file.upload);
        url.searchParams.append("entityId", entityId);
        url.searchParams.append("context", context);
        url.searchParams.append("isPublic", isPublic.toString());

        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader }
            : {};

        const res = await fetch(url.toString(), {
            method: "POST",
            credentials: "include",
            headers,
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to upload file");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to upload file:", error);
        throw error;
    }
}

/**
 * Update file metadata
 */
export async function updateFile(id: string, metadata: Partial<FileInfo>, isAdmin: boolean = false, cookieHeader: string | null = null): Promise<FileInfo> {
    try {
        if (!isAdmin) {
            throw new Error("Unauthorized");
        }

        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const res = await fetch(ADMIN_API.file.update(id), {
            method: "PUT",
            credentials: "include",
            headers,
            body: JSON.stringify(metadata),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to update file");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to update file:", error);
        throw error;
    }
}

/**
 * Delete a file
 */
export async function deleteFile(id: string, isAdmin: boolean = false, cookieHeader: string | null = null): Promise<void> {
    try {
        if (!isAdmin) {
            throw new Error("Unauthorized");
        }

        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader }
            : {};

        const res = await fetch(ADMIN_API.file.delete(id), {
            method: "DELETE",
            credentials: "include",
            headers,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to delete file");
        }
    } catch (error) {
        console.error("Failed to delete file:", error);
        throw error;
    }
}
