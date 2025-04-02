"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCareerEntry, saveCareerEntry } from "@/services/careerService";
import { type CareerEntry, type CareerEntryCreate } from "@/models/CareerEntry";

interface CareerEntryFormProps {
  initialId?: string;
}

export default function CareerEntryForm({ initialId }: CareerEntryFormProps) {
  const router = useRouter();
  const [entry, setEntry] = useState<CareerEntry | CareerEntryCreate>({
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
    async function loadData() {
      try {
        if (initialId == 'new') {
          const newEntry: CareerEntryCreate = {
            title: '',
            company: '',
            location: '',
            description: '',
            startDate: '',
            endDate: null,
            skills: [],
            type: 'job',             
          };
          setEntry(newEntry);
        }
        else if(initialId){
          const existingEntry = await fetchCareerEntry(initialId);
          if (existingEntry) {
            setEntry({
              ...existingEntry,
              startDate: existingEntry.startDate ? new Date(existingEntry.startDate).toISOString().split("T")[0] : "",
              endDate: existingEntry.endDate ? new Date(existingEntry.endDate).toISOString().split("T")[0] : "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load career entry:", err);
        setError("Failed to load existing career entry data.");
      }
    }

    loadData();
  }, [initialId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveCareerEntry(entry);
      router.push("/admin/career");
    } catch (err) {
      console.error("Failed to save career entry:", err);
      setError("Failed to save career entry.");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{initialId ? "Edit Career Entry" : "Add Career Entry"}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={entry.title}
          onChange={(e) => setEntry({ ...entry, title: e.target.value })}
          className="w-full p-2 border rounded text-gray-700"
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={entry.company || ""}
          onChange={(e) => setEntry({ ...entry, company: e.target.value })}
          className="w-full p-2 border rounded text-gray-700"
        />
        <input
          type="date"
          value={entry.startDate}
          onChange={(e) => setEntry({ ...entry, startDate: e.target.value })}
          className="w-full p-2 border rounded text-gray-700"
          required
        />
        <input
          type="date"
          value={entry.endDate || ""}
          onChange={(e) => setEntry({ ...entry, endDate: e.target.value || null })}
          className="w-full p-2 border rounded text-gray-700"
        />
        <textarea
          placeholder="Description"
          value={entry.description || ""}
          onChange={(e) => setEntry({ ...entry, description: e.target.value })}
          className="w-full p-2 border rounded text-gray-700"
        />
        <input
          type="text"
          placeholder="Skills (comma-separated)"
          value={entry.skills.join(", ")}
          onChange={(e) => setEntry({ ...entry, skills: e.target.value.split(",").map((s) => s.trim()) })}
          className="w-full p-2 border rounded text-gray-700"
        />

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {initialId ? "Save Changes" : "Add Entry"}
        </button>
      </form>
    </div>
  );
}
