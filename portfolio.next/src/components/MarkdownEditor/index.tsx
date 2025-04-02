import { useState } from 'react';
import { marked } from 'marked';
import type { MarkdownEditorProps } from './index.d';

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="space-y-2">
      <div className="flex border-b">
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'edit' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit
        </button>
        <button
          type="button"
          className={`px-4 py-2 ${activeTab === 'preview' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      {activeTab === 'edit' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-64 p-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Write your content here (Markdown supported)"
        />
      ) : (
        <div 
          className="w-full h-64 p-2 border rounded-md bg-gray-50 overflow-auto prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: marked.parse(value) }}
        />
      )}
    </div>
  );
}
