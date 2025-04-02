'use client';

import { Project, ProjectCreate } from '@/models/Project';
import { useEffect, useState } from 'react';
import { createProject, updateProject } from '@/services/projectService';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/components/MarkdownEditor';
import { useLoading } from '@/context/LoadingContext';
import { useTransition } from 'react';

interface EditProjectProps {
  initialProject?: Project;
}

export default function EditProject({ initialProject }: EditProjectProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const { showLoading, hideLoading } = useLoading();

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProjectCreate>({
    title: initialProject?.title || '',
    description: initialProject?.description || '',
    excerpt: initialProject?.excerpt || '',
    image: initialProject?.image,
    link: initialProject?.link,
    isDraft: initialProject?.isDraft ?? true,
    publishAt: initialProject?.publishAt || null,
    tags: initialProject?.tags || [],
    industry: initialProject?.industry || 'General',
    status: initialProject?.status || 'planned',
    startDate: initialProject?.startDate,
    endDate: initialProject?.endDate,
    technologies: initialProject?.technologies || []
  });

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
        if (initialProject) {
          await updateProject(initialProject._id, formData);
        } else {
          await createProject(formData);
        }
      } catch (err) {
        console.error('Failed to save project:', err);
        setError('Failed to save project');
      } finally {
        setSaving(false);
      }
    });
  }

  const [tags, setTags] = useState<string>(initialProject?.tags?.join(',') || '');
  const [technologies, setTechnologies] = useState<string>(initialProject?.technologies?.join(',') || '');

  function handleTagsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawInput = e.target.value;
    const tmpTags = rawInput.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags: tmpTags }));
    setTags(rawInput);
  }

  function handleTechnologiesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawInput = e.target.value;
    const tmpTech = rawInput.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, technologies: tmpTech }));
    setTechnologies(rawInput);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
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
          Short Excerpt
        </label>
        <textarea
          value={formData.excerpt}
          onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Description (Markdown)
        </label>
        <MarkdownEditor
          value={formData.description}
          onChange={(value: string) => setFormData(prev => ({ ...prev, description: value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Status
          </label>
          <select
            value={formData.status}
            onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as ProjectCreate['status'] }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Industry
          </label>
          <input
            type="text"
            value={formData.industry}
            onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate ? formData.startDate.slice(0, 10) : ''}
            onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate ? formData.endDate.slice(0, 10) : ''}
            onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Image URL
          </label>
          <input
            type="url"
            value={formData.image || ''}
            onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Project URL
          </label>
          <input
            type="url"
            value={formData.link || ''}
            onChange={e => setFormData(prev => ({ ...prev, link: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={handleTagsChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Technologies (comma-separated)
        </label>
        <input
          type="text"
          value={technologies}
          onChange={handleTechnologiesChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!formData.isDraft}
            onChange={e => setFormData(prev => ({ ...prev, isDraft: !e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-200">Published</span>
        </label>

        {!formData.isDraft && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Publish Date
            </label>
            <input
              type="datetime-local"
              value={formData.publishAt ? formData.publishAt.slice(0, 16) : ''}
              onChange={e => setFormData(prev => ({ ...prev, publishAt: e.target.value ? e.target.value : null }))}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
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
          {saving ? 'Saving...' : initialProject ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
