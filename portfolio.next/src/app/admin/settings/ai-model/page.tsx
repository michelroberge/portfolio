import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import AIModelSettings from "@/components/admin/AIModelSettings";
import { getAIConfig } from "@/services/aiService";

export default async function AiModelSettingsPage() {
  await protectAdminRoute();

  // Fetch AI config server-side for SSR
  const aiConfig = await getAIConfig();
  
  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Model Settings</h1>
        <AIModelSettings initialConfig={aiConfig} />
      </div>
    </AdminLayout>
  );
}
