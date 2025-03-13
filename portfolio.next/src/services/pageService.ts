import { PUBLIC_API, ADMIN_API } from "@/lib/constants";
import { Page } from "@/models/Page";

/**
 * Fetch a page by slug
 */
export async function fetchPageBySlug(slug: string, fromCache: boolean = true): Promise<Page> {
    try {
        const res = await fetch(`${PUBLIC_API.page.list}/slug/${slug}`, {
            credentials: "include", // Include for potential admin access
            ...(fromCache ? {} : { cache: "no-store" }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to fetch page");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch page:", error);
        throw error;
    }
}

/**
 * Fetch all pages
 */
export async function fetchPages(): Promise<Page[]> {
    try {
        const res = await fetch(PUBLIC_API.page.list, {
            credentials: "include", // Include for potential admin access
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to fetch pages");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch pages:", error);
        throw error;
    }
}

/**
 * Create a new page
 */
export async function createPage(page: Omit<Page, '_id'>): Promise<Page> {
    try {
        const res = await fetch(ADMIN_API.page.create, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(page),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to create page");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to create page:", error);
        throw error;
    }
}

/**
 * Update an existing page
 */
export async function updatePage(id: string, page: Partial<Page>): Promise<Page> {
    try {
        const res = await fetch(ADMIN_API.page.update(id), {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(page),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to update page");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to update page:", error);
        throw error;
    }
}

/**
 * Delete a page
 */
export async function deletePage(id: string): Promise<void> {
    try {
        const res = await fetch(ADMIN_API.page.delete(id), {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to delete page");
        }
    } catch (error) {
        console.error("Failed to delete page:", error);
        throw error;
    }
}