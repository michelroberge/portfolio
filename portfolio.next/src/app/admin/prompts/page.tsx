import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import PromptList from "@/components/admin/PromptList";
import {Prompt} from '@/models/Prompt'
import { fetchPrompts  } from "@/services/promptService";

interface PromptContentProps {
  prompts: Prompt[];
  cookieHeader: string;
}

const PromptContent = ({ prompts, cookieHeader }: PromptContentProps) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Prompts Management</h1>
      <PromptList initialPrompts={prompts} cookieHeader={cookieHeader} />
    </div>
  );
};

export default async function PromptsManagementPage() {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);
  
  // Fetch pages server-side for SSR
  const pages = await fetchPrompts(cookieHeader);

  return (
    <AdminLayout>
      <PromptContent prompts={pages} cookieHeader={cookieHeader} />
    </AdminLayout>
  );
}
