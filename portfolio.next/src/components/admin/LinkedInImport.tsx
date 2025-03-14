"use client";

import { useState } from "react";
import { parseLinkedInHTMLBackend, saveParsedJobs } from "@/services/careerService";
import type { LinkedInParseResult } from "@/services/careerService";

export default function LinkedInImport() {
  const [rawHTML, setRawHTML] = useState("");
  const [parsedJobs, setParsedJobs] = useState<LinkedInParseResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleParseHTML() {
    if (!rawHTML.trim()) return alert("Paste your LinkedIn HTML first!");
    try {
      const jobs = await parseLinkedInHTMLBackend(rawHTML);
      setParsedJobs(jobs);
    } catch (err) {
      console.error("Failed to parse LinkedIn data:", err);
      setError("Failed to parse LinkedIn data.");
    }
  }

  async function handleImportToBackend() {
    if (parsedJobs.length === 0) return alert("No parsed jobs to import!");

    try {
      await saveParsedJobs(parsedJobs);
      alert("Career entries imported successfully!");
      setParsedJobs([]); // Clear the list after successful import
      setRawHTML(""); // Clear the textarea
    } catch (err) {
      console.error("Failed to import LinkedIn data:", err);
      setError("Failed to import LinkedIn data.");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Career Timeline Management</h1>

      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          To import your LinkedIn career history:
        </p>
        <ol className="list-decimal list-inside text-gray-600 mb-2">
          <li>Go to your <strong>LinkedIn profile</strong> and open the Experience section.</li>
          <li>Right-click on the job list and select <strong>Inspect</strong>.</li>
          <li>Copy the HTML of the experience section.</li>
          <li>Paste it below.</li>
          <li>Click &quot;Parse & Import&quot;.</li>
        </ol>

        <textarea
          value={rawHTML}
          onChange={(e) => setRawHTML(e.target.value)}
          placeholder="Paste your LinkedIn Experience HTML here..."
          className="w-full p-2 border rounded mb-2 h-60 font-mono"
        />

        <button 
          onClick={handleParseHTML} 
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={!rawHTML.trim()}
        >
          Parse & Import
        </button>

        {parsedJobs.length > 0 && (
          <button 
            onClick={handleImportToBackend} 
            className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save to Backend
          </button>
        )}
      </div>

      {parsedJobs.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Parsed Jobs:</h2>
          <ul className="list-disc list-inside">
            {parsedJobs.map((job, index) => (
              <li key={index} className="mb-2">
                <strong>{job.title}</strong> at {job.company} ({job.startDate} - {job.endDate || 'Present'})
                <br />
                <span className="text-gray-600 ml-6">{job.location}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
