import { notFound } from "next/navigation";
import { fetchBlogEntry } from "@/services/blogService";
import BlogView from "@/components/blog/BlogView";

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  const id = slug.split("-").pop(); // Extract the last part as the ID
  if (!id) return notFound();

  try {
    const blog = await fetchBlogEntry(id);
    return <BlogView blog={blog} />;
  } catch (err) {
    console.error('Failed to fetch blog:', err);
    return notFound();
  }
}
