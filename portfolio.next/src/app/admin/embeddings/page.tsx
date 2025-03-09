import { getAuthUser } from "@/services/authService";
import RefreshEmbeddings from "@/components/admin/RefreshEmbeddings";
import { redirect } from "next/navigation";

export default async function AdminEmbeddingsPage() {
  const user = await getAuthUser();

  if (!user || !user.isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage AI Embeddings</h1>
      <RefreshEmbeddings />
    </div>
  );
}
