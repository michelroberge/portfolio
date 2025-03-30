'use client';

import { useEffect, useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Page, PageFormData } from '@/models/Page';
import MarkdownEditor from '@/components/MarkdownEditor';
import { createPage, updatePage } from '@/services/pageService';
import { useLoading } from '@/context/LoadingContext';

interface EditPageProps {
  initialPage?: Page;
}

export default function EditPage({ initialPage }: EditPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PageFormData>({
    title: initialPage?.title || '',
    slug: initialPage?.slug || '',
    content: initialPage?.content || '',
    tags: initialPage?.tags || [],
  });

  const [isPending, startTransition] = useTransition();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isPending) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isPending, showLoading, hideLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      setSaving(true);
      setError(null);

      try {
        if (initialPage) {
          await updatePage(initialPage._id, formData);
        } else {
          // Create a new page without _id field
          const newPage: Omit<Page, '_id'> = {
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            tags: formData.tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await createPage(newPage);
        }
      } catch (err) {
        console.error('Failed to save page:', err);
        setError('Failed to save page');
      } finally {
        setSaving(false);
      }
    });

  }

  function handleTagsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Slug
        </label>
        <div className="flex items-center mt-1">
          <span className="text-gray-500 mr-1">/</span>
          <input
            type="text"
            value={formData.slug}
            onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            pattern="[a-z0-9-]+"
            title="Lowercase letters, numbers, and hyphens only"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Lowercase letters, numbers, and hyphens only
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Content (Markdown)
        </label>
        <MarkdownEditor
          value={formData.content}
          onChange={(value: string) => setFormData(prev => ({ ...prev, content: value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : initialPage ? 'Update Page' : 'Create Page'}
        </button>
      </div>
    </form>
  );
}
