import { redirect } from "next/navigation";
import { getAuthUser } from "@/services/authService";
import RefreshEmbeddings from "@/components/admin/RefreshEmbeddings";

export default async function AdminEmbeddingsPage() {
  const { authenticated, user } = await getAuthUser();

  if (!authenticated || !user?.isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage AI Embeddings</h1>
      <RefreshEmbeddings />
    </div>
  );
}
