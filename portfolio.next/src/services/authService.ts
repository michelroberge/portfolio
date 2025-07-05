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
    const res = await fetch(AUTH_API.auth.status, {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) {
      return { authenticated: false, user: null };
    }

    const data = await res.json();
    return {
      authenticated: true,
      user: data.user,
    };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { authenticated: false, user: null, message: "Auth check failed" };
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  try {
    // Step 1: Clear local session
    const res = await fetch(AUTH_API.auth.logout, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Logout failed");
    }

    // Step 2: Get OIDC logout URL
    const oidcRes = await fetch("/api/oidc/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!oidcRes.ok) {
      const error = await oidcRes.json();
      throw new Error(error.message || "OIDC Logout failed");
    }
    const { logoutUrl } = await oidcRes.json();

    // Step 3: Redirect to OIDC logout
    if (logoutUrl) {
      window.location.assign(logoutUrl);
    }
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}
