// portfolio.next/src/context/AuthContext.tsx
"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation"; 

interface AuthContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  user: User | null;
  setIsAuthenticated: (val: boolean) => void;
  setUser: (user: User | null) => void;
  refreshAuth: () => Promise<void>;
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`, {
        credentials: "include",
      });
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

  // useEffect(() => {
  //   refreshAuth();
  // }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, isAuthenticated, user, setIsAuthenticated, setUser, refreshAuth }}>
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
