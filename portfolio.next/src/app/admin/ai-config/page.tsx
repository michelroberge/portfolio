import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import AIModelSettings from "@/components/admin/AIModelSettings";
import { getAIConfig } from "@/services/aiService";

export default async function AIConfigPage() {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  // Fetch AI config server-side for SSR
  const config = await getAIConfig();

  return (
    <AdminLayout>
      <AIModelSettings initialConfig={config} />
    </AdminLayout>
  );
}
