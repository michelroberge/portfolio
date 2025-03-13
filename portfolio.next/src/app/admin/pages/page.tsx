import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import PagesList from "@/components/admin/PagesList";

const PageContent = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pages Management</h1>
      <PagesList />
    </div>
  );
};

export default async function PagesManagementPage() {
  await protectAdminRoute();

  return (
    <AdminLayout>
      <PageContent />
    </AdminLayout>
  );
}
