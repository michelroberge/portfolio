// portfolio.next/src/app/admin/projects/new/page.tsx

import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditProject from "@/components/admin/EditProject";

export default async function NewProjectPage() {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
        <EditProject />
      </div>
    </AdminLayout>
  );
}
