'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Prompt, PromptFormData } from '@/models/Prompt';
import MarkdownEditor from '@/components/MarkdownEditor';
import { createPrompt, updatePrompt } from '@/services/promptService';

interface EditPromptProps {
  initialPrompt?: Prompt;
  header?: string;
}

export default function EditPrompt({ initialPrompt, header }: EditPromptProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PromptFormData>({
    name: initialPrompt?.name || '',
    template: initialPrompt?.template || '',
    parameters: initialPrompt?.parameters || [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (initialPrompt) {
        await updatePrompt(initialPrompt._id, formData, header || "");
      } else {
        // Create a new page without _id field
        const newPrompt: Omit<Prompt, '_id'> = {
          name: formData.name,
          template: formData.template,
          parameters: formData.parameters,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await createPrompt(newPrompt, header || "");
      }
      router.push('/admin/prompts');
    } catch (err) {
      console.error('Failed to save prompt:', err);
      setError('Failed to save prompt');
    } finally {
      setSaving(false);
    }
  }

  function handleParametersChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parameters = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, parameters }));
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="block p-4 border border-gray-200 dark:border-gray-700 transition rounded-lg dark:hover:bg-gray-700">
        <label className="block text-sm font-medium ">
          Title
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Template
        </label>
        <MarkdownEditor
          value={formData.template}
          onChange={(value: string) => setFormData(prev => ({ ...prev, template: value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.parameters.join(', ')}
          onChange={handleParametersChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800 px-2 py-1"
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
          {saving ? 'Saving...' : initialPrompt ? 'Update Page' : 'Create Page'}
        </button>
      </div>
    </form>
  );
}
