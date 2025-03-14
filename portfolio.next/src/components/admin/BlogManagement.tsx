'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { type BlogEntry } from '@/models/BlogEntry';
import { fetchBlogEntries, deleteBlogEntry } from '@/services/blogService';

export default function BlogManagement() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadBlogs = async () => {
    try {
      const data = await fetchBlogEntries();
      setBlogs(data);
      setError(null);
      router.refresh(); // Forces Next.js to refetch SSR data
    } catch (err) {
      console.error('Failed to load blogs:', err);
      setError('Failed to load blogs');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog entry?')) return;
    
    try {
      await deleteBlogEntry(id);
      setBlogs(blogs.filter(blog => blog._id !== id));
      setError(null);
      router.refresh(); // Forces Next.js to refetch SSR data
    } catch (err) {
      console.error('Failed to delete blog:', err);
      setError('Failed to delete blog');
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Blog Entry
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{blog.title}</h2>
              <p className="text-sm text-gray-600">{blog.excerpt}</p>
              <div className="mt-2 flex gap-2">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/blogs/${blog._id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(blog._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
