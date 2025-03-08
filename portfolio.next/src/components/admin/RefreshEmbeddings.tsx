"use client";

import { useState } from "react";

export default function RefreshEmbeddings() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRefresh() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/embeddings/initialize`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh embeddings");
      }

      setMessage("Embeddings refreshed successfully!");
    } catch (error) {
      setMessage("Error refreshing embeddings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Refresh AI Embeddings</h2>
      <p className="mb-2 text-gray-600">
        This will reset all embeddings and regenerate them for blogs, projects, pages, and files.
      </p>
      <button
        onClick={handleRefresh}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {loading ? "Refreshing..." : "Refresh Embeddings"}
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
