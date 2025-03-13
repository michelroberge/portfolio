"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Page } from "@/models/Page";
import { fetchPages, deletePage } from "@/services/pageService";

export default function PagesList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    try {
      const data = await fetchPages();
      setPages(data);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
      setError('Failed to load pages');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      await deletePage(id);
      setPages(pages.filter(page => page._id !== id));
    } catch (err) {
      console.error('Failed to delete page:', err);
      setError("Failed to delete page");
    }
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Custom Pages</h2>
        <Link 
          href="/admin/pages/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Page
        </Link>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <div key={page._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{page.title}</h3>
                <p className="text-gray-500 text-sm">/{page.slug}</p>
              </div>
              <div className="flex space-x-2">
                <Link 
                  href={`/admin/pages/edit/${page._id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(page._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
