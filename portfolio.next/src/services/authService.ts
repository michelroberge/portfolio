import { AUTH_API } from "@/lib/constants";
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
 * Interface for login credentials
 */
export interface LoginCredentials {
  /**
   * The username for login.
   */
  username: string;
  /**
   * The password for login.
   */
  password: string;
}

/**
 * Login user with credentials
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const res = await fetch(AUTH_API.auth.login, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    return res.json();
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

/**
 * Check authentication status
 */
export async function checkAuthStatus(): Promise<AuthResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch(AUTH_API.auth.status, {
      method: "GET",
      credentials: "include",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return { authenticated: false, user: null };
    }

    const data = await res.json();
    return {
      authenticated: data.authenticated || false,
      user: data.user || null,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log("Auth check was cancelled");
      return { authenticated: false, user: null, message: "Auth check cancelled" };
    }
    console.error("Auth check failed:", error);
    return { authenticated: false, user: null, message: "Auth check failed" };
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  try {
    // Call backend logout endpoint
    const res = await fetch(AUTH_API.auth.logout, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Logout failed");
    }

    const data = await res.json();

    // If OIDC logout URL is provided, redirect to it
    if (data.logoutUrl) {
      window.location.assign(data.logoutUrl);
    } else {
      // For local auth, just reload to clear state
      window.location.assign('/admin/login');
    }
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if logout fails, redirect to login
    window.location.assign('/admin/login');
  }
}
