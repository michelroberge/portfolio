// portfolio.next/src/services/userService.ts

import { API_ENDPOINTS } from "@/lib/constants";
import { User } from "@/models/User";

/**
 * Fetches all users from the backend
 * @returns Promise<User[]> List of users
 */
export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.admin.users}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to fetch users:", err);
    throw err;
  }
}

/**
 * Updates a user's admin status
 * @param userId The ID of the user to update
 * @param isAdmin Whether the user should be an admin
 * @returns Promise<User> The updated user
 */
export async function updateUserAdmin(
  userId: string,
  isAdmin: boolean
): Promise<User> {
  try {
    const response = await fetch(`${API_ENDPOINTS.admin.users}/${userId}/admin`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ isAdmin }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user admin status");
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to update user admin status:", err);
    throw err;
  }
}
