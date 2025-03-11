// portfolio.next/src/app/[slug]/page.tsx
import { notFound } from "next/navigation";
import { marked } from "marked";
import { API_ENDPOINTS } from "@/lib/constants";

async function fetchPage(slug: string) {
  const res = await fetch(`${API_ENDPOINTS.page}/slug/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: {params: Promise<{ slug: string }>}) {

  const { slug } = await params;

  if (!slug) return notFound();

  const page = await fetchPage(slug);

  if (!page) {
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(page.content) }} />
    </div>
  );
}
