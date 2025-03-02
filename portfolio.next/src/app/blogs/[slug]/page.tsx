// portfolio.next/src/app/blogs/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getBlog } from "@/services/blogService";
import { marked } from "marked";
import CommentSection from "@/components/CommentSection";

// interface BlogEntry {
//   _id: number;
//   title: string;
//   publishAt: string;
//   body: string;
//   excerpt?: string;
//   link: string;
// }

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) return notFound();

  // Extract the last number after '-' in the slug as the id.
  const id = slug.split("-").pop();
  if (!id) return notFound();

  const blog = await getBlog(id);

  if (!blog) return notFound();

  return (
    <>
      <main className="container mx-auto px-6 py-10 flex flex-col flex-1">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        <p className="text-gray-500">
            {new Date(blog.publishAt).toLocaleString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
  
        {/* Wrap the Markdown content inside a "prose" div */}
        <div className="mt-4 prose lg:prose-lg xl:prose-xl max-w-none"
             dangerouslySetInnerHTML={{ __html: marked.parse(blog.body) }} />

        <CommentSection blogId={String(blog._id)} />

      </main>
    </>
  );
  
}
