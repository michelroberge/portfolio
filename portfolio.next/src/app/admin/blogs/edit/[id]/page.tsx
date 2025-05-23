import { notFound } from "next/navigation";
import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditBlogEntry from "@/components/admin/EditBlogEntry";
import { fetchBlogEntry } from "@/services/blogService";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: Props) {
  // This will automatically redirect if not authenticated or not admin
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  const { id } = await params;
  
  if (!id) return notFound();

  try {
    // Fetch blog data server-side for SSR
    const blog = await fetchBlogEntry(id, true, cookieHeader) ;
    if (!blog) return notFound();
    
    return (
      <AdminLayout>
        <EditBlogEntry initialData={blog} cookieHeader={cookieHeader} />
      </AdminLayout>
    );
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return notFound();
  }
}
