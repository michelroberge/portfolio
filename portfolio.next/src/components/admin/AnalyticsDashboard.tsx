'use client';

import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/lib/constants";

interface TelemetryData {
  users: number;
  blogPosts: number;
  projects: number;
  sessions: number;
  pageHits: number;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const res = await fetch(`${API_ENDPOINTS.analytics}/telemetry`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error("Failed to fetch telemetry data");
        const telemetry = await res.json();
        setData(telemetry);
      } catch (err) {
        console.error('Failed to fetch telemetry:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
    loadTelemetry();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Users</h2>
        <p className="text-3xl dark:text-gray-100">{data.users}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Blog Posts</h2>
        <p className="text-3xl dark:text-gray-100">{data.blogPosts}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Projects</h2>
        <p className="text-3xl dark:text-gray-100">{data.projects}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Active Sessions</h2>
        <p className="text-3xl dark:text-gray-100">{data.sessions}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">Page Hits</h2>
        <p className="text-3xl dark:text-gray-100">{data.pageHits}</p>
      </div>
    </div>
  );
}
