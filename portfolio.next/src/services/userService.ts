// portfolio.next/src/services/userService.ts

import { ADMIN_API } from "@/lib/constants";
import { User, UserCreate } from "@/models/User";

/**
 * Fetch all users
 */
export async function fetchUsers(isAdmin: boolean = false, cookieHeader: string | null = null): Promise<User[]> {
    try {

        if ( !isAdmin){
            throw new Error("Unauthorized");
        }
        
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader } // Pass cookies for SSR requests
            : {};

        const response = await fetch(ADMIN_API.user.list, {
            credentials: "include",
            headers,
            cache: "no-store",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch users");
        }

        return response.json();
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
}

/**
 * Create a new user
 */
export async function createUser(user: UserCreate, cookieHeader: string | null = null): Promise<User> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const response = await fetch(ADMIN_API.user.create, {
            method: "POST",
            credentials: "include",
            headers,
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create user");
        }

        return response.json();
    } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
    }
}

/**
 * Update an existing user
 */
export async function updateUser(id: string, user: Partial<User>, cookieHeader: string | null = null): Promise<User> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const response = await fetch(ADMIN_API.user.update(id), {
            method: "PUT",
            credentials: "include",
            headers,
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update user");
        }

        return response.json();
    } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
    }
}

/**
 * Update user admin status
 */
export async function updateUserAdmin(id: string, isAdmin: boolean, cookieHeader: string | null = null): Promise<User> {
    try {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
        };

        const response = await fetch(ADMIN_API.user.updateAdmin(id), {
            method: "PUT",
            credentials: "include",
            headers,
            body: JSON.stringify({ isAdmin }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update user admin status");
        }

        return response.json();
    } catch (error) {
        console.error("Failed to update user admin status:", error);
        throw error;
    }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string, cookieHeader: string | null = null): Promise<void> {
    try {
        const headers: HeadersInit = cookieHeader
            ? { Cookie: cookieHeader }
            : {};

        const response = await fetch(ADMIN_API.user.delete(id), {
            method: "DELETE",
            credentials: "include",
            headers,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete user");
        }
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw error;
    }
}
