// portfolio.next/src/app/blogs/[slug]/page.tsx
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlog } from "@/services/blogService";

interface BlogEntry {
  id: number;
  title: string;
  date: string;
  body: string;
  excerpt?: string;
  link: string;
}

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
      <Header />
      <main className="container mx-auto px-6 py-10 flex flex-col lg:flex-row lg:gap-8 flex-1">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        <p className="text-gray-500">{blog.date}</p>
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: blog.body }} />
      </main>
      <Footer />
    </>
  );
}
