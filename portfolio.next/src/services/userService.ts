// portfolio.next/src/services/userService.ts

import { ADMIN_API } from "@/lib/constants";
import { User, UserCreate } from "@/models/User";

/**
 * Fetch all users
 */
export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch(ADMIN_API.user.list, {
            credentials: "include",
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
export async function createUser(user: UserCreate): Promise<User> {
    try {
        const response = await fetch(ADMIN_API.user.create, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
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
export async function updateUser(id: string, user: Partial<User>): Promise<User> {
    try {
        const response = await fetch(ADMIN_API.user.update(id), {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
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
export async function updateUserAdmin(id: string, isAdmin: boolean): Promise<User> {
    try {
        const response = await fetch(ADMIN_API.user.updateAdmin(id), {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
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
export async function deleteUser(id: string): Promise<void> {
    try {
        const response = await fetch(ADMIN_API.user.delete(id), {
            method: "DELETE",
            credentials: "include",
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
