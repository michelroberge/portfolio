"use client";
import { useState, useEffect } from "react";
import { fetchPages, createPage, updatePage, deletePage } from "@/services/pageService";
import { Page, PageFormData } from "@/models/Page";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [form, setForm] = useState<PageFormData>({ title: "", slug: "", content: "", tags: [] });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/admin/login?returnUrl=/admin/pages');
      return;
    }
    loadPages();
  }, [isAuthenticated, isAdmin, router]);

  async function loadPages() {
    try {
      const data = await fetchPages();
      setPages(data);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
      setError('Failed to load pages');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    const { _id, ...baseData } = form;
    
    try {
      if (editing && _id) {
        await updatePage(_id, baseData);
      } else {
        await createPage(baseData);
      }
      
      await loadPages();
      setForm({ title: "", slug: "", content: "", tags: [] });
      setEditing(false);
    } catch (err) {
      console.error('Failed to save page:', err);
      setError('Failed to save page');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePage(id);
      await loadPages();
    } catch (err) {
      console.error('Failed to delete page:', err);
      setError('Failed to delete page');
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Pages</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-6">
        {editing ? (
          <div className="border p-4 rounded-lg shadow-md bg-white space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Page Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                id="slug"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="url-friendly-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                id="content"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-40"
                placeholder="Content (Markdown supported)"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                id="tags"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="tag1, tag2, tag3"
                value={form.tags.join(", ")}
                onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map(tag => tag.trim()) })}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setForm({ title: "", slug: "", content: "", tags: [] });
                  setEditing(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {editing ? 'Update' : 'Create'} Page
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setForm({ title: "", slug: "", content: "", tags: [] });
              setEditing(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add New Page
          </button>
        )}
      </form>

      <ul className="space-y-2">
        {pages.map((page) => (
          <li key={page._id} className="flex justify-between items-center p-4 bg-white border rounded-md shadow-sm hover:shadow">
            <span className="font-medium">{page.title}</span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => {
                  const { ...formData } = page;
                  setForm(formData);
                  setEditing(true);
                }}
                className="text-blue-500 hover:text-blue-700 focus:outline-none focus:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(page._id)}
                className="text-red-500 hover:text-red-700 focus:outline-none focus:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
