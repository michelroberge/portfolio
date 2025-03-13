import { notFound } from "next/navigation";
import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditBlogEntry from "@/components/admin/EditBlogEntry";
import { fetchBlogEntry } from "@/services/blogService";

export default async function AdminBlogEditPage({ params }: { params: { id: string } }) {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  try {
    // Fetch blog data server-side for SSR
    const blog = await fetchBlogEntry(params.id);
    
    return (
      <AdminLayout>
        <EditBlogEntry initialData={blog} />
      </AdminLayout>
    );
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return notFound();
  }
}
