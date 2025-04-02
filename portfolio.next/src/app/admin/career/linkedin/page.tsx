import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import LinkedInImport from "@/components/admin/LinkedInImport";

export default async function LinkedInImportPage() {
  await protectAdminRoute();

  return (
    <AdminLayout>
      <LinkedInImport />
    </AdminLayout>
  );
}
