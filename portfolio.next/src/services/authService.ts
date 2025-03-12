import { API_ENDPOINTS } from "@/lib/constants";
import { User } from "@/models/User";

/**
 * Interface representing the response from authentication checks.
 */
export interface AuthResponse {
  /**
   * Whether the user is authenticated.
   */
  authenticated: boolean;
  /**
   * The authenticated user, or null if not authenticated.
   */
  user: User | null;
  /**
   * Optional message providing additional context.
   */
  message?: string;
}

/**
 * Server-side authentication check.
 * 
 * This function is intended to be used on the server-side to verify the user's authentication status.
 * 
 * @returns A promise resolving to an AuthResponse object.
 */
export async function getAuthUser(): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_ENDPOINTS.auth}/check`, {
      method: "GET",
      credentials: "include",
      cache: "no-store"
    });

    if (!res.ok) {
      console.log("Authentication failed");
      return { authenticated: false, user: null, message: `${API_ENDPOINTS.auth}/admin/login` };
    }

    const data = await res.json();
    if (!data.authenticated || !data.user) {
      return { authenticated: false, user: null, message: "Authentication failed" };
    }

    return {
      authenticated: true,
      user: data.user,
      message: "authenticated"
    };
  } catch (err) {
    console.error("Error fetching auth status:", err);
    return { authenticated: false, user: null, message: "Auth check failed" };
  }
}

/**
 * Client-side authentication check.
 * 
 * This function is intended to be used on the client-side to verify the user's authentication status.
 * 
 * @returns A promise resolving to an AuthResponse object.
 */
export async function checkAuthStatus(): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_ENDPOINTS.auth}/check`, {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) {
      return { authenticated: false, user: null, message: "Authentication failed" };
    }

    const data = await res.json();
    if (!data.authenticated || !data.user) {
      return { authenticated: false, user: null, message: "Authentication failed" };
    }

    return {
      authenticated: true,
      user: data.user,
      message: "authenticated"
    };
  } catch (err) {
    console.error("Error checking auth status:", err);
    return { authenticated: false, user: null, message: "Auth check failed" };
  }
}
