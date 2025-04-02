"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditBlogEntry from "@/components/admin/EditBlogEntry";
import { BlogEntry } from "@/models/BlogEntry";
import { fetchBlogEntry } from "@/services/blogService";

export default function BlogEditPage() {
  const params = useParams() as { id?: string };
  const [blog, setBlog] = useState<BlogEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBlog(id: string) {
      try {
        const data = await fetchBlogEntry(id);
        setBlog(data);
      } catch (err) {
        console.error('Failed to fetch blog:', err);
        setError('Failed to load blog');
      }
    }

    if (params.id) {
      loadBlog(params.id);
    }
  }, [params.id]);

  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Loading...</div>;

  return <EditBlogEntry initialData={blog} />;
}
