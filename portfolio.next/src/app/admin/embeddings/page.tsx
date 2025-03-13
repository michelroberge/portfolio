import { useAuth } from "@/context/AuthContext";
import RefreshEmbeddings from "@/components/admin/RefreshEmbeddings";

export default async function EmbeddingsManagement() {
  const { isAuthenticated, user } = await useAuth();
  if (!isAuthenticated || !user || !user.isAdmin) {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage AI Embeddings</h1>
      <RefreshEmbeddings />
    </div>
  );
}
