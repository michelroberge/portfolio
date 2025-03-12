import { redirect } from "next/navigation";
import { getAIConfig } from "@/services/aiService";
import AIModelSettings from "@/components/admin/AIModelSettings";
import { getAuthUser } from "@/services/authService";

export default async function AIModelSettingsPage() {
  const { authenticated, user } = await getAuthUser();
  if (!authenticated || !user || !user.isAdmin) {
    const baseAddress = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    redirect(`${baseAddress}/admin/login?returnUrl=%2Fadmin%2Fsettings%2Fai-model`);
  }
  else{
    const aiConfig = await getAIConfig();
    return <AIModelSettings initialConfig={aiConfig} />;
  }
}
