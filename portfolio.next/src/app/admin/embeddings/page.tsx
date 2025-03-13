import { protectAdminRoute } from "@/lib/auth";
import RefreshEmbeddings from "@/components/admin/RefreshEmbeddings";

export default async function EmbeddingsManagement() {
  await protectAdminRoute();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage AI Embeddings</h1>
      <RefreshEmbeddings />
    </div>
  );
}
