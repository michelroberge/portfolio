import { redirect } from "next/navigation";
import { getAuthUser } from "@/services/authService";
import { getBlogs } from "@/services/blogService";
import BlogManagement from "@/components/admin/BlogManagement";

export default async function AdminBlogPage() {
  const user = await getAuthUser();

  if (!user || !user.isAdmin) {
    const baseAddress = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    redirect(`${baseAddress}/admin/login?returnUrl=%2Fadmin%2Fblogs`); // ✅ Redirect instead of `notFound()`
  }

  const blogs = await getBlogs(); // Fetch blogs on the server

  return <BlogManagement initialBlogs={blogs || []} />;
}
