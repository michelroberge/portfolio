import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProviderConfigManager from "@/components/admin/ProviderConfigManager";

export default async function ProviderConfigPage() {
  await protectAdminRoute();

  return (
    <AdminLayout>
      <ProviderConfigManager />
    </AdminLayout>
  );
}
