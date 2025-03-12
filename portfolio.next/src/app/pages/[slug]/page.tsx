// portfolio.next/src/app/[slug]/page.tsx
import { notFound } from "next/navigation";
import { marked } from "marked";
import { fetchPage } from "@/services/pageService";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) return notFound();

  try {
    const page = await fetchPage(slug);
    if (!page) return notFound();

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: marked.parse(page.content) }} />
      </div>
    );
  } catch (err) {
    console.error('Failed to fetch page:', err);
    return notFound();
  }
}
