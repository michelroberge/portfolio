"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Prompt } from "@/models/Prompt";
import { fetchPrompts, deletePrompt } from "@/services/promptService";
interface PromptsListProps {
  initialPrompts?: Prompt[];
  cookieHeader?: string;
}

export default function promptsList({ initialPrompts = [], cookieHeader }: PromptsListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPrompts.length === 0) {
      loadPrompts();
    }
  }, [initialPrompts]);

  async function loadPrompts() {
    try {
      const data = await fetchPrompts(cookieHeader || "");
      setPrompts(data);
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
      setError('Failed to load prompts');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    try {
      await deletePrompt(id, cookieHeader || "");
      setPrompts(prompts.filter(prompt => prompt._id !== id));
    } catch (err) {
      console.error('Failed to delete prompt:', err);
      setError("Failed to delete prompt");
    }
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prompts</h2>
        <Link 
          href="/admin/prompts/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Prompt
        </Link>
      </div>

      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <div key={prompt._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{prompt.name}</h3>
              </div>
              <div className="flex space-x-2">
                <Link 
                  href={`/admin/prompts/edit/${prompt._id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(prompt._id)}
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
