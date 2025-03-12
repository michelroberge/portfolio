import { redirect } from "next/navigation";
import { getAuthUser } from "@/services/authService";
import BlogManagementPage from "@/components/admin/BlogManagementPage";
import { API_ENDPOINTS, APP_ROUTES } from "@/lib/constants";

export default async function AdminBlogPage() {
  const {user} = await getAuthUser();
  if (!user || !(user?.isAdmin)) {
    redirect(`${API_ENDPOINTS.auth}/admin/login?returnUrl=${encodeURIComponent(APP_ROUTES.admin.blogs)}`);
  }

  // BlogManagementPage now handles its own data fetching on the client side
  return <BlogManagementPage />;
}
