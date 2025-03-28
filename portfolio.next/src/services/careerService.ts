import { PUBLIC_API, ADMIN_API } from '@/lib/constants';
import { CareerEntry } from '@/models/CareerEntry';

/**
 * Interface for LinkedIn parse result
 */
export interface LinkedInParseResult {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    description: string;
}

/**
 * Fetch all career entries
 */
export async function fetchCareerTimeline(isAdmin: boolean = false, cookieHeader: string | null = null): Promise<CareerEntry[]> {
    try {
        const url = isAdmin ? ADMIN_API.career.create : PUBLIC_API.career.list;
        
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
            throw new Error(error.message || "Failed to fetch career timeline");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch career timeline:", error);
        throw error;
    }
}

/**
 * Fetch a career entry by ID
 */
export async function fetchCareerEntry(id: string, isAdmin: boolean = false, cookieHeader: string | null = null): Promise<CareerEntry> {
    try {
        const url = isAdmin ? ADMIN_API.career.get(id) : PUBLIC_API.career.get(id);
        
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
            throw new Error(error.message || "Failed to fetch career entry");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch career entry:", error);
        throw error;
    }
}

/**
 * Save (create or update) a career entry
 */
export async function saveCareerEntry(entry: Partial<CareerEntry> & { _id?: string }, cookieHeader: string | null = null): Promise<CareerEntry> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        if (entry._id) {
            // Update existing entry
            const res = await fetch(ADMIN_API.career.update(entry._id), {
                method: "PUT",
                credentials: "include",
                headers,
                body: JSON.stringify(entry),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update career entry");
            }

            return res.json();
        } else {
            // Create new entry
            const res = await fetch(ADMIN_API.career.create, {
                method: "POST",
                credentials: "include",
                headers,
                body: JSON.stringify(entry),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create career entry");
            }

            return res.json();
        }
    } catch (error) {
        console.error("Failed to save career entry:", error);
        throw error;
    }
}

/**
 * Delete a career entry
 */
export async function deleteCareerEntry(id: string, cookieHeader: string | null = null): Promise<void> {
    try {
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader }
            : {};

        const res = await fetch(ADMIN_API.career.delete(id), {
            method: "DELETE",
            credentials: "include",
            headers,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to delete career entry");
        }
    } catch (error) {
        console.error("Failed to delete career entry:", error);
        throw error;
    }
}

/**
 * Parse LinkedIn HTML data on the backend
 */
export async function parseLinkedInHTMLBackend(rawHTML: string, cookieHeader: string | null = null): Promise<LinkedInParseResult[]> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const res = await fetch(ADMIN_API.career.parseLinkedIn, {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify({ rawHTML }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to parse LinkedIn data");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to parse LinkedIn data:", error);
        throw error;
    }
}

/**
 * Save parsed LinkedIn jobs to the backend
 */
export async function saveParsedJobs(jobs: LinkedInParseResult[], cookieHeader: string | null = null): Promise<CareerEntry[]> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const res = await fetch(ADMIN_API.career.bulkImport, {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify(jobs),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to save parsed jobs");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to save parsed jobs:", error);
        throw error;
    }
}

export async function refreshEmbeddings(cookieHeader: string) {
    try {
        const headers: HeadersInit = {
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const res = await fetch(ADMIN_API.career.regenerate, {
            method: "POST",
            credentials: "include",
            headers,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to save parsed jobs");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to save parsed jobs:", error);
        throw error;
    }
}