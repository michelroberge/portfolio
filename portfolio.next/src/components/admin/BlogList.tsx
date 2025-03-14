"use client";

import { useRouter } from "next/navigation";
import { BlogEntry } from "@/models/BlogEntry";

interface BlogListProps {
  blogs: BlogEntry[];
}

export default function BlogList({ blogs }: BlogListProps) {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <button
          onClick={() => router.push('/admin/blogs/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Blog
        </button>
      </div>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
            <p className="text-gray-600 mb-2">{blog.excerpt}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{blog.isDraft ? 'Draft' : 'Published'}</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              <div className="flex-grow"></div>
              <button
                onClick={() => router.push(`/admin/blogs/edit/${blog._id}`)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
