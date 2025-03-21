// portfolio.next/src/app/admin/pages/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditPrompt from "@/components/admin/EditPrompt";
import { fetchPrompt } from "@/services/promptService";
import { Prompt } from "@/models/Prompt";

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  // This will automatically redirect if not authenticated or not admin
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  const { id } = await params;
  if (!id) return notFound();

  try {
    // Fetch page data server-side for SSR
    let prompt : Prompt | undefined = undefined;
    if ( id != 'new'){
      prompt = await fetchPrompt(id, cookieHeader);
      if (!prompt) return notFound();
    }


    return (
      <AdminLayout>
        <EditPrompt initialPrompt={prompt} header={cookieHeader} />
      </AdminLayout>
    );
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return notFound();
  }
}
