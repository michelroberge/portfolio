"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchCareerTimeline, deleteCareerEntry } from "@/services/careerService";
import Link from "next/link";


interface CareerEntry {
  _id: string;
  title: string;
  company?: string;
  startDate: string;
  endDate?: string | null;
  skills: string[];
  linkedEntries: string[];
  importedFromLinkedIn: boolean;
}

export default function CareerTimelineAdmin() {
  const { isAuthenticated, user } = useAuth();
  const [timeline, setTimeline] = useState<CareerEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await fetchCareerTimeline();
        setTimeline(data);
      } catch (err) {
        setError("Failed to load career timeline.");
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) loadEntries();
  }, [isAuthenticated]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteCareerEntry(id);
      setTimeline((prev) => prev.filter((entry) => entry._id !== id)); // ✅ Remove from UI
    } catch (err) {
      setError("Failed to delete entry.");
    }
  }
  

  if (!isAuthenticated || !user?.isAdmin) return <p>Only admins can access this page.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Career Timeline Management</h1>

      {/* Import from LinkedIn Button */}
      <div className="flex justify-between mb-4">
        
        <Link href="/admin/career/linkedin" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Parse from Linkedin
        </Link>

        <Link href="/admin/career/edit/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Add Entry
        </Link>
      </div>
      

      {/* Timeline Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Title</th>
            <th className="border p-2 text-left">Company</th>
            <th className="border p-2 text-left">Start Date</th>
            <th className="border p-2 text-left">End Date</th>
            <th className="border p-2 text-left">Skills</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeline.map((entry) => (
            <tr key={entry._id} className="border">
              <td className="border p-2">
                {entry.title}
                {entry.importedFromLinkedIn && <span className="text-blue-500 text-sm ml-2">(LinkedIn)</span>}
              </td>
              <td className="border p-2">{entry.company || "-"}</td>
              <td className="border p-2">{new Date(entry.startDate).toLocaleDateString()}</td>
              <td className="border p-2">{entry.endDate ? new Date(entry.endDate).toLocaleDateString() : "Present"}</td>
              <td className="border p-2">{entry.skills.join(", ") || "-"}</td>
              <td className="border p-2">
                <Link href={`/admin/career/edit/${entry._id}`} className="text-blue-500 hover:underline mr-4">
                  Edit
                </Link>
                <button onClick={() => handleDelete(entry._id)} className="text-red-500 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
