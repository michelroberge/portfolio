"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchCareerEntry, saveCareerEntry } from "@/services/careerService";
import { type CareerEntry} from "@/models/CareerEntry";

export default function EditCareerEntry() {
  const router = useRouter();
  const params = useParams();
  const entryId = params.id as string | undefined;
  const { isAuthenticated, user } = useAuth();

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
    async function loadData() {
      try {
        if (entryId) {
            const existingEntry = await fetchCareerEntry(entryId);
            if (existingEntry) {
              setEntry({
                ...existingEntry,
                startDate: existingEntry.startDate ? new Date(existingEntry.startDate).toISOString().split("T")[0] : "",
                endDate: existingEntry.endDate ? new Date(existingEntry.endDate).toISOString().split("T")[0] : "",
              });
            }
          }
      } catch (err) {
        console.error(err);
        setError("Failed to load existing career entry data.");
      }
    }

    if (isAuthenticated) loadData();
  }, [isAuthenticated, entryId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveCareerEntry(entry);
      router.push("/admin/career");
    } catch (err) {
      console.error(err);
      setError("Failed to save career entry.");
    }
  }

  if (!isAuthenticated || !(user?.isAdmin)) return <p>Only admins can access this page.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{entryId ? "Edit Career Entry" : "Add Career Entry"}</h1>
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
          {entryId ? "Save Changes" : "Add Entry"}
        </button>
      </form>
    </div>
  );
}
