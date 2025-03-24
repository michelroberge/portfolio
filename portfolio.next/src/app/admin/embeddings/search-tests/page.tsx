import { protectAdminRoute, getAdminCookie } from "@/lib/auth";

export default async function DocumentEmbedggings() {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Embeddings search tests</h1>
      <p>{cookieHeader}</p>
    </div>
  );
}
