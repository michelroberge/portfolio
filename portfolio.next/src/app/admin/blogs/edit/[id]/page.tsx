"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import EditBlogEntry from "@/components/admin/EditBlogEntry";
import { BlogEntry } from "@/models/BlogEntry";
import { fetchBlogEntry } from "@/services/blogService";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const [blog, setBlog] = useState<BlogEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    
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
  }, [params.id, isAuthenticated]);

  if (!isAuthenticated || !(user?.isAdmin)) {
    router.push('/auth/login');
    return null;
  }

  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Loading...</div>;

  return <EditBlogEntry initialData={blog} />;
}
