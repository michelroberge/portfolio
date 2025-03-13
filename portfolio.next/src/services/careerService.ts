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
export async function fetchCareerTimeline(): Promise<CareerEntry[]> {
    try {
        const res = await fetch(PUBLIC_API.career.list, {
            credentials: "include",
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
export async function fetchCareerEntry(id: string): Promise<CareerEntry> {
    try {
        const res = await fetch(PUBLIC_API.career.get(id), {
            credentials: "include",
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
export async function saveCareerEntry(entry: Partial<CareerEntry> & { _id?: string }): Promise<CareerEntry> {
    try {
        if (entry._id) {
            // Update existing entry
            const res = await fetch(ADMIN_API.career.update(entry._id), {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
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
                headers: {
                    "Content-Type": "application/json",
                },
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
export async function deleteCareerEntry(id: string): Promise<void> {
    try {
        const res = await fetch(ADMIN_API.career.delete(id), {
            method: "DELETE",
            credentials: "include",
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
export async function parseLinkedInHTMLBackend(rawHTML: string): Promise<LinkedInParseResult[]> {
    try {
        const res = await fetch(ADMIN_API.career.parseLinkedIn, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
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
export async function saveParsedJobs(jobs: LinkedInParseResult[]): Promise<CareerEntry[]> {
    try {
        const res = await fetch(ADMIN_API.career.bulkImport, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
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
