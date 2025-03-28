import { protectAdminRoute, getAdminCookie } from "@/lib/auth";

interface Props {
    params: Promise<{ collection: string, id: string }>;
  }
  
export default async function DocumentEmbedggings({ params }: Props) {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);
  const { collection, id } = await params;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{collection} Embeddings for record id: {id}</h1>
      <p>{cookieHeader}</p>
    </div>
  );
}
