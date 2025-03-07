// portfolio.next/src/components/CareerTimeline.tsx
"use client";
import React, { useState, useEffect } from "react";
import EntryOverview from "./EntryOverview";
import { fetchCareerTimeline } from "@/services/careerService";
import { marked } from "marked";

interface CareerEntry {
  _id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string;
}

const formatDate = (date: string | null) => {
  if (!date) return "Present";
  return new Intl.DateTimeFormat("default", { year: "numeric", month: "short" }).format(new Date(date));
};

const CareerTimeline: React.FC = () => {
  const [entries, setEntries] = useState<CareerEntry[]>([]);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchCareerTimeline();
      setEntries(data);
    }
    loadData();
  }, []);

  return (
    <div className="relative">
      {/* Dark vertical timeline bar */}
      <div className="absolute left-3 top-0 bottom-0 w-6 bg-gray-800"></div>

      <div className="relative space-y-6 pl-10">
        {entries.map((entry) => (
          <div key={entry._id} className="relative">
            {/* Timeline connector */}
            <div className="absolute left-0 top-6 w-6 h-6 bg-gray-800 rounded-full"></div>
            <div className="ps-8">
            {/* Entry Overview */}
            <EntryOverview
              title={entry.title}
              company={entry.company}
              startDate={formatDate(entry.startDate)}
              endDate={formatDate(entry.endDate)}
              location={entry.location}
              onClick={() => setExpandedEntryId(expandedEntryId === entry._id ? null : entry._id)}
            />

            {/* Expanded Details (In-Place) */}
            {expandedEntryId === entry._id && (
              <div className="mt-2 p-4 border-l-4 border-blue-500 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-500">{entry.location}</p>
                <div
                  className="mt-2 text-gray-700 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: marked.parse(entry.description) }}
                />

                <button onClick={() => setExpandedEntryId(null)} className="mt-2 text-blue-500">
                  Close
                </button>
              </div>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerTimeline;
