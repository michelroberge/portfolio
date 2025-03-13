"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CareerEntry } from "@/models/CareerEntry";
import { fetchCareerTimeline, deleteCareerEntry } from "@/services/careerService";

export default function CareerTimelineManager() {
  const [timeline, setTimeline] = useState<CareerEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const data = await fetchCareerTimeline();
      setTimeline(data);
    } catch (err) {
      console.error('Failed to fetch career timeline:', err);
      setError('Failed to load career timeline');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteCareerEntry(id);
      setTimeline((prev) => prev.filter((entry) => entry._id !== id)); 
    } catch (err) {
      console.error('Failed to delete career entry:', err);
      setError("Failed to delete entry.");
    }
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Career Timeline Management</h1>
        <Link href="/admin/career/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Add Entry
        </Link>
      </div>

      <div className="space-y-4">
        {timeline.map((entry) => (
          <div key={entry._id} className="bg-white p-4 rounded-lg shadow">
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
