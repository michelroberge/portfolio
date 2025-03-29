'use client';

import React, { useState, useEffect } from "react";
import EntryOverview from "./EntryOverview";
import { type CareerEntry } from "@/models/CareerEntry";
import { fetchCareerTimeline } from "@/services/careerService";
import { marked } from "marked";

const formatDate = (date: string | null | undefined): string => {
  if (!date) return "Present";
  return new Intl.DateTimeFormat("default", { year: "numeric", month: "short" }).format(new Date(date));
};

export default function CareerTimeline() {
  const [entries, setEntries] = useState<CareerEntry[]>([]);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCareerTimeline();
        setEntries(data);
      } catch (err) {
        console.error('Failed to load career timeline:', err);
      }
    }
    loadData();
  }, []);
  
  // Function to handle toggling the expanded entry
  const toggleExpanded = (id: string): void => {
    // If current expanded ID matches clicked ID, collapse it by setting to null
    // Otherwise, expand the clicked entry by setting its ID
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };
  
  return (
    <div className="relative">
      {/* Dark vertical timeline bar */}
      <div className="absolute left-3 top-0 bottom-0 w-6 bg-gray-700"></div>
      
      <div className="relative space-y-6 pl-10">
        {entries.map((entry) => (
          <div key={entry._id} className="relative">
            {/* Timeline connector */}
            <div className="absolute left-0 top-6 w-6 h-6 bg-gray-700 rounded-full"></div>
            <div className="ps-8">
              {/* Entry Overview */}
              <EntryOverview
                title={entry.title}
                company={entry.company}
                startDate={formatDate(entry.startDate)}
                endDate={formatDate(entry.endDate)}
                location={entry.location}
                skills={entry.skills}
                onClick={() => entry._id && toggleExpanded(entry._id)}
              />
              
              {/* Expanded Details (In-Place) */}
              {entry._id && expandedEntryId === entry._id && (
                <div className="ms-4 mt-2 p-4 border-l-4 border-blue-500 rounded-md bg-primary ">
                  <p className="text-sm text-gray-500">{entry.location}</p>
                  <div
                    className="mt-2 prose prose-sm max-w-none text-gray-500"
                    dangerouslySetInnerHTML={{ __html: marked(entry.description) }}
                  />
                  
                  <button
                    onClick={() => setExpandedEntryId(null)}
                    className="mt-2 text-blue-500 hover:underline"
                  >
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
}