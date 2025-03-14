import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import BlogList from "@/components/admin/BlogList";
import { fetchBlogEntries, } from "@/services/blogService";

export default async function AdminBlogPage() {
  // This will automatically redirect if not authenticated or not admin
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  // Fetch blogs server-side for SSR
  const blogs = await fetchBlogEntries(true, cookieHeader);
  
  return (
    <AdminLayout>
      <BlogList blogs={blogs} />
    </AdminLayout>
  );
}
