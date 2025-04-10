import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditBlogEntry from "@/components/admin/EditBlogEntry";

export default async function NewBlogPage() {
  // This will automatically redirect if not authenticated or not admin
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Create a New Blog Entry</h1>
        <EditBlogEntry cookieHeader={cookieHeader} />
      </div>
    </AdminLayout>
  );
}
