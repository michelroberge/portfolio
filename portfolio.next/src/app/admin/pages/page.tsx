"use client";
import { useState, useEffect } from "react";
import { fetchPages, createPage, updatePage, deletePage } from "@/services/pageService";

interface PageData {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
}

export default function AdminPages() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [form, setForm] = useState<PageData>({ title: "", slug: "", content: "", tags: [] });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function loadPages() {
      setPages(await fetchPages());
    }
    loadPages();
  }, []);

  async function handleSubmit() {
    if (form._id) {
      await updatePage(form._id, form);
    } else {
      // Ensure a new entry starts with a blank state (no _id)
      const newPage = { ...form };
      delete newPage._id;  // Remove `_id` to ensure it's a new entry
      await createPage(newPage);
    }
    
    // Refresh the list after submission
    setPages(await fetchPages());
  
    // Reset form
    setForm({ title: "", slug: "", content: "", tags: [] });
    setEditing(false);
  }
  

  async function handleDelete(id: string) {
    await deletePage(id);
    setPages(await fetchPages());
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Pages</h1>

      {editing ? (
        <div className="border p-4 rounded-lg shadow-md bg-white">
          <input
            className="border p-2 w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border p-2 w-full mt-2"
            placeholder="Slug (URL-friendly)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <textarea
            className="border p-2 w-full mt-2 h-40"
            placeholder="Content (Markdown supported)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <input
            className="border p-2 w-full mt-2"
            placeholder="Tags (comma separated)"
            value={form.tags.join(", ")}
            onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map(tag => tag.trim()) })}
          />

          <div className="flex justify-between mt-4">
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            <button onClick={() => setEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      ) : (
<button
  onClick={() => {
    setForm({ title: "", slug: "", content: "", tags: [] }); // Reset form for new entry
    setEditing(true);
  }}
  className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
>
  Add New Page
</button>
      )}

      <ul className="mt-4 space-y-2">
        {pages.map((page) => (
          <li key={page._id} className="flex justify-between items-center p-2 border rounded-md">
            <span>{page.title}</span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setForm(page);
                  setEditing(true);
                }}
                className="text-blue-500"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(page._id!)} className="text-red-500">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
