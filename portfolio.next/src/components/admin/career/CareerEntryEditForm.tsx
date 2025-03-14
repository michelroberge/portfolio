"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type CareerEntry } from "@/models/CareerEntry";
import { saveCareerEntry } from "@/services/careerService";

interface CareerEntryEditFormProps {
  initialEntry?: CareerEntry | null;
}

export default function CareerEntryEditForm({ initialEntry }: CareerEntryEditFormProps) {
  const router = useRouter();
  const isNewEntry = !initialEntry?._id;

  const [entry, setEntry] = useState<CareerEntry>({
    title: "",
    company: "",
    startDate: "",
    endDate: null,
    description: "",
    skills: [],
    importedFromLinkedIn: false,
    _id: "",
    type: "job",
    order: 0,
    createdAt: "",
    updatedAt: "",
    location: "",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEntry) {
      setEntry({
        ...initialEntry,
        startDate: initialEntry.startDate ? new Date(initialEntry.startDate).toISOString().split("T")[0] : "",
        endDate: initialEntry.endDate ? new Date(initialEntry.endDate).toISOString().split("T")[0] : null,
      });
    }
  }, [initialEntry]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveCareerEntry(entry);
      router.push('/admin/career');
    } catch (err) {
      console.error(err);
      setError("Failed to save career entry.");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{isNewEntry ? "Add Career Entry" : "Edit Career Entry"}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={entry.title}
          onChange={(e) => setEntry({ ...entry, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={entry.company || ""}
          onChange={(e) => setEntry({ ...entry, company: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={entry.location || ""}
          onChange={(e) => setEntry({ ...entry, location: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={entry.startDate}
          onChange={(e) => setEntry({ ...entry, startDate: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={entry.endDate || ""}
          onChange={(e) => setEntry({ ...entry, endDate: e.target.value || null })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={entry.description || ""}
          onChange={(e) => setEntry({ ...entry, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Skills (comma-separated)"
          value={entry.skills.join(", ")}
          onChange={(e) => setEntry({ ...entry, skills: e.target.value.split(",").map((s) => s.trim()) })}
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {isNewEntry ? "Add Entry" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
