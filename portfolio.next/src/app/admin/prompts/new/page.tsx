import { notFound } from "next/navigation";
import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import EditPrompt from "@/components/admin/EditPrompt";
import AdminLayout from "@/components/layouts/AdminLayout";

export default async function CreatePromptPage() {
const { user } = await protectAdminRoute();
const { cookieHeader } = await getAdminCookie(user);

try {
    // Fetch project data server-side for SSR

    return (
    <AdminLayout>
        <EditPrompt initialPrompt={undefined} header={cookieHeader}/>
    </AdminLayout>
    );
} catch (error) {
    console.error('Failed to fetch project:', error);
    return notFound();
}
}
  