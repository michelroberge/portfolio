// portfolio.next/src/context/AuthContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { AUTH_API, APP_ROUTES } from "@/lib/constants";
import { User } from '@/models/User';
import { checkAuthStatus } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  initialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start as loading
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin ?? false;

  // Check auth status when component mounts - but only once
  useEffect(() => {
    if (!initialized) {
      refreshAuth();
    }
  }, [initialized]);

  async function refreshAuth() {
    try {
      setLoading(true);
      const { authenticated, user: authUser } = await checkAuthStatus();
      
      if (!authenticated) {
        setUser(null);
      } else {
        setUser(authUser);
      }
      setInitialized(true);
    } catch (err) {
      console.error('Failed to refresh auth:', err);
      setUser(null);
      setError("Authentication failed");
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }

  async function login(username: string, password: string): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(AUTH_API.auth.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }


      await refreshAuth(); // Use refreshAuth instead of directly setting user
    } catch (err) {
      console.error('Failed to login:', err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function logout(): Promise<void> {
    try {
      await fetch(AUTH_API.auth.logout, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error('Failed to logout:', err);
    } finally {
      setUser(null);
      router.push(APP_ROUTES.auth.login);
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      isAuthenticated,
      isAdmin,
      initialized,
      login, 
      logout, 
      refreshAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
