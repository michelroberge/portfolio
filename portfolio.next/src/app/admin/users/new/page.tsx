import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import CreateUser from "@/components/admin/CreateUser";

export default async function NewUserPage() {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New User</h1>
        <CreateUser />
      </div>
    </AdminLayout>
  );
}
