import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/lib/constants";

export interface AuthUser {
  id: string;
  isAdmin: boolean;
  message: string | null;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies(); // ✅ Manually access cookies on the server
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      console.log("No token found in cookies");
      return {id : "0", isAdmin: false, message: "no cookie found"};
    }

    const res = await fetch(`${API_ENDPOINTS.auth}/check`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }, // ✅ Send token manually
      credentials: "include",
    });

    if (!res.ok) {
      console.log("Authentication failed");
      return {id : "0", isAdmin: false, message: `${API_ENDPOINTS.auth}/admin/login`};
    }

    const data = await res.json();
    if (!data.authenticated || !data.user) return null;

    return {
      id: data.user.id,
      isAdmin: data.user.isAdmin,
      message: "should be good"
    };
  } catch (error) {
    console.error("Error fetching auth status:", error);
    return null;
  }
}
