'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type BlogEntry, BaseBlogEntry, BlogEntryCreate } from '@/models/BlogEntry';
import MarkdownEditor from '@/components/MarkdownEditor';
import { createBlogEntry, updateBlogEntry } from '@/services/blogService';

interface Props {
  initialData?: BlogEntry;
}

export default function EditBlogEntry({ initialData }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<BaseBlogEntry>({
    title: initialData?.title || '',
    body: initialData?.body || '',
    excerpt: initialData?.excerpt || '',
    tags: initialData?.tags || [],
    isDraft: initialData?.isDraft ?? true,
    publishAt: initialData?.publishAt || null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?._id) {
        await updateBlogEntry(initialData._id, formData);
      } else {
        const newBlog: BlogEntryCreate = {
          ...formData,
          link: '', // Will be generated on the backend
        };
        await createBlogEntry(newBlog);
      }
      router.push('/admin/blogs');
    } catch (err) {
      console.error('Failed to save blog entry:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev: BaseBlogEntry) => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData((prev: BaseBlogEntry) => ({ ...prev, excerpt: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          required
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <MarkdownEditor
          value={formData.body}
          onChange={(value: string) => setFormData((prev: BaseBlogEntry) => ({ ...prev, body: value }))}
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags.join(', ')}
          onChange={(e) => setFormData((prev: BaseBlogEntry) => ({ 
            ...prev, 
            tags: e.target.value.split(',').map(tag => tag.trim()) 
          }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDraft"
          checked={formData.isDraft}
          onChange={(e) => setFormData((prev: BaseBlogEntry) => ({ ...prev, isDraft: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isDraft" className="ml-2 block text-sm text-gray-900">
          Save as Draft
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialData ? 'Update' : 'Create'} Blog Entry
        </button>
      </div>
    </form>
  );
}
