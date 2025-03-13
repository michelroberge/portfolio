import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditBlogEntry from "@/components/admin/EditBlogEntry";

export default async function NewBlogPage() {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Create a New Blog Entry</h1>
        <EditBlogEntry />
      </div>
    </AdminLayout>
  );
}
