import { ADMIN_API } from '@/lib/constants';
import { AdminCheckResponse } from '@/models/AdminCheck';
import { AdminInitRequest } from '@/models/AdminInit';

/**
 * Check if an admin user exists in the system
 */
export async function checkAdminExists(): Promise<AdminCheckResponse> {
  try {
    const res = await fetch(ADMIN_API.user.adminExists, {
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to check admin status");
    }

    return res.json();
  } catch (err) {
    console.error("Failed to check admin status:", err);
    throw err;
  }
}

/**
 * Initialize the first admin user in the system
 */
export async function initializeAdmin(request: AdminInitRequest): Promise<void> {
  try {
    const res = await fetch(ADMIN_API.user.initialize, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create admin account");
    }
  } catch (err) {
    console.error("Failed to create admin account:", err);
    throw err;
  }
}
