"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CareerEntry } from "@/models/CareerEntry";
import { fetchCareerTimeline, deleteCareerEntry, refreshEmbeddings } from "@/services/careerService";

interface CareerTimelineManagerProps {
  initialTimeline?: CareerEntry[];
  cookieHeader?: string;
}

export default function CareerTimelineManager({ initialTimeline = [], cookieHeader }: CareerTimelineManagerProps) {
  const [timeline, setTimeline] = useState<CareerEntry[]>(initialTimeline);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    async function loadEntries() {
      try {
        const data = await fetchCareerTimeline(true, cookieHeader || null);
        setTimeline(data);
      } catch (err) {
        console.error('Failed to fetch career timeline:', err);
        setError('Failed to load career timeline');
      }
    }

    if (initialTimeline.length === 0) {
      loadEntries();
    }
  }, [initialTimeline, cookieHeader]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteCareerEntry(id, cookieHeader || null);
      setTimeline((prev) => prev.filter((entry) => entry._id !== id)); 
    } catch (err) {
      console.error('Failed to delete career entry:', err);
      setError("Failed to delete entry.");
    }
  }

  async function handleRegenerate(){
    await refreshEmbeddings(cookieHeader || "");
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Career Timeline Management</h1>
        <Link href="/admin/career/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Add Entry
        </Link>
        <button onClick={() => handleRegenerate()} className="btn button text-blue-500 hover:text-blue-600">
          Regenerate Embeddings
        </button>
      </div>

      <div className="space-y-4">
        {timeline.map((entry) => (
          <div key={entry._id} className="border border-gray-200 dark:border-gray-700 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 p-4">
            <h2 className="text-xl font-semibold mb-2">{entry.title}</h2>
            <p className="text-gray-600 mb-2">{entry.company || "-"}</p>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(entry.startDate).toLocaleDateString()} - {entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}
            </p>
            <div className="flex space-x-2">
              <Link href={`/admin/career/edit/${entry._id}`} className="text-blue-500 hover:text-blue-600">
                Edit
              </Link>
              <button onClick={() => handleDelete(entry._id || "")} className="text-red-500 hover:text-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
