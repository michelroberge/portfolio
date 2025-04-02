'use client';

import { useState } from 'react';
import { marked } from 'marked';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {isPreview ? (
        <div 
          className="prose prose-sm max-w-none p-4 border rounded-md min-h-[200px] bg-gray-50"
          dangerouslySetInnerHTML={{ __html: marked(value) }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[200px] p-4 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-800 px-2 py-1"
          placeholder="Write your content in Markdown..."
        />
      )}
    </div>
  );
}
