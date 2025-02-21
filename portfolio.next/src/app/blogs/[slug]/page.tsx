import { notFound } from "next/navigation";
import Header from "@/components/Header";

interface BlogEntry {
  id: number;
  title: string;
  date: string;
  body: string;
}

async function getBlog(id: string): Promise<BlogEntry | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`;

    console.log("Get blog url", url);
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();

  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function BlogPage({ params }: { params: Record<string, string> }) {
  // Wait for params before accessing them
  const { slug } = params;

  if (!slug) return notFound();

  // Extract the last number after '-' in the slug
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
    <footer className="bg-gray-800 text-white text-center py-4 mt-6">
        <p>&copy; {new Date().getFullYear()} My Portfolio. All Rights Reserved.</p>
      </footer>
    </>
  );
}
