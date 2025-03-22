import { PUBLIC_API, ADMIN_API } from "@/lib/constants";
import { Page } from "@/models/Page";

/**
 * Fetch a page by slug
 */
export async function fetchPageBySlug(slug: string, isAdmin: boolean = false, cookieHeader: string | null = null, fromCache: boolean = true): Promise<Page> {
    try {
        const url = isAdmin ? ADMIN_API.page.get(slug) : PUBLIC_API.page.get(slug);
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } // Pass cookies for SSR requests
            : {};

        const res = await fetch(url, {
            credentials: "include",
            headers,
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
export async function fetchPages(isAdmin: boolean = false, cookieHeader: string | null = null): Promise<Page[]> {
    try {
        const url = isAdmin ? ADMIN_API.page.list : PUBLIC_API.page.list;
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } // Pass cookies for SSR requests
            : {};

        const res = await fetch(url, {
            credentials: "include",
            headers,
            cache: "no-store",
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
export async function createPage(page: Omit<Page, '_id'>, cookieHeader: string | null = null): Promise<Page> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const res = await fetch(ADMIN_API.page.create, {
            method: "POST",
            credentials: "include",
            headers,
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
export async function updatePage(id: string, page: Partial<Page>, cookieHeader: string | null = null): Promise<Page> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const res = await fetch(ADMIN_API.page.update(id), {
            method: "PUT",
            credentials: "include",
            headers,
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
export async function deletePage(id: string, cookieHeader: string | null = null): Promise<void> {
    try {
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader }
            : {};

        const res = await fetch(ADMIN_API.page.delete(id), {
            method: "DELETE",
            credentials: "include",
            headers,
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

export async function convertPageBySlug(slug: string, cookieHeader: string | null = null, fromCache: boolean = true): Promise<Page> {
    try {
        
        const url = ADMIN_API.page.convert(slug);
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } // Pass cookies for SSR requests
            : {};

        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers,
            ...(fromCache ? {} : { cache: "no-store" }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to convert page");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to convert page:", error);
        throw error;
    }
}