import { cookies } from "next/headers";

export interface AuthUser {
  id: string;
  isAdmin: boolean;
  message: string | null;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies(); // ✅ Manually access cookies on the server
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      console.log("No token found in cookies");
      return {id : "0", isAdmin: false, message: "no cookie found"};
    }

    const res = await fetch(`${apiUrl}/api/auth/check`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }, // ✅ Send token manually
      credentials: "include",
    });

    if (!res.ok) {
      console.log("Authentication failed");
      return {id : "0", isAdmin: false, message: apiUrl};
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
