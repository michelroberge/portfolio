import { notFound } from "next/navigation";
import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditBlogEntry from "@/components/admin/EditBlogEntry";
import { fetchBlogEntry } from "@/services/blogService";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: Props) {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  const { id } = await params;
  if (!id) return notFound();

  try {
    // Fetch blog data server-side for SSR
    const blog = await fetchBlogEntry(id);
    if (!blog) return notFound();
    
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
