import { useAuth } from "@/context/AuthContext";
import AIModelSettings from "@/components/admin/AIModelSettings";
import { getAIConfig } from "@/services/aiService";

export default async function AiModelSettings() {
  const { isAuthenticated, user } = await useAuth();
  if (!isAuthenticated || !user || !user.isAdmin) {
    return <p>You are not authorized to view this page.</p>;
  }

  const aiConfig = await getAIConfig();
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Model Settings</h1>
      <AIModelSettings initialConfig={aiConfig} />
    </div>
  );
}
