import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
