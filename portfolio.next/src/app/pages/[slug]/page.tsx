// portfolio.next/src/app/[slug]/page.tsx
import { notFound } from "next/navigation";
import { marked } from "marked";
import { fetchPageBySlug } from "@/services/pageService";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) return notFound();

  try {
    const page = await fetchPageBySlug(slug);
    if (!page) return notFound();

    return (
      <div className="max-w-fit mx-auto p-6">
        <div 
        className="prose 
          dark:prose-headings:text-gray-300
          dark:prose-p:text-gray-400 
          dark:prose-a:text-blue-400 
          dark:prose-li:text-gray-500 
          dark:prose-strong:text-gray-400
          p-2 lg:prose-lg xl:prose-xl max-w-fit" 
        dangerouslySetInnerHTML={{ __html: marked.parse(page.content) }} />
      </div>
    );
  } catch (err) {
    console.error('Failed to fetch page:', err);
    return notFound();
  }
}
