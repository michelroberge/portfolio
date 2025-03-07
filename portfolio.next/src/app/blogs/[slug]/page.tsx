import { notFound } from "next/navigation";
import { getBlog } from "@/services/blogService";
import { BlogEntry } from "@/models/BlogEntry";
import BlogView from "@/components/BlogView";

const BlogPage = async ({params,}: {params: Promise<{ slug: string }>}) => {
  
  const { slug } = await params;

  if (!slug) return notFound();

  const id = slug.toString().split("-").pop(); // Extract the last part as the ID
  if (!id) return notFound();

  const blog: BlogEntry | null = await getBlog(id);
  if (!blog) return notFound();

  return <BlogView blog={blog} />;
};

export default BlogPage;
