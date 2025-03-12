// portfolio.next/src/context/AuthContext.tsx
"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation"; 
import { API_ENDPOINTS } from "@/lib/constants";

interface AuthContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  user: User | null;
  setIsAuthenticated: (val: boolean) => void;
  setUser: (user: User | null) => void;
  refreshAuth: () => Promise<void>;
  login: (username : string, password : string) => Promise<boolean>;
}

interface User {
  username: string;
  isAdmin: boolean;
  // Add other user properties as needed.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  async function refreshAuth() {
    try {
      const res = await fetch(`${API_ENDPOINTS.auth}/check`, {
        credentials: "include",
      });
      

      if (!res || !res.ok) {
        console.error("Login request failed", res);
        return;
      }
      
      const data = await res.json();
      if ( data.setupRequired){
        router.push("/admin/setup"); // Redirect to setup page
        return;
      }
      setIsAuthenticated(data.authenticated);
      setUser(data.authenticated ? data.user : null);
      setIsAdmin(data.user?.isAdmin || false);
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
    }
  }

  async function login(username : string, password : string) : Promise<boolean>  {
    const res = await fetch(`${API_ENDPOINTS.auth}/login`, {
      method: "POST",
      credentials: "include", // Ensures the auth-token cookie is stored
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res || !res.ok) {
      console.error("Login request failed", res);
      return false;
    }
    
    if (res.ok) {
      await refreshAuth();
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  return (
    <AuthContext.Provider value={{ isAdmin, isAuthenticated, user, setIsAuthenticated, setUser, refreshAuth, login }}>
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
