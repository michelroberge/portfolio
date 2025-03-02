// portfolio.next/src/app/admin/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface TelemetryData {
  users: number;
  blogPosts: number;
  projects: number;
  sessions: number;
  pageHits: number;
}
const apiUrl : string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const res = await fetch(`${apiUrl}/api/telemetry`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch telemetry data");
        const telemetry = await res.json();
        setData(telemetry);
      } catch (err: unknown) { // ✅ Use "unknown" instead of "any"
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }
    if (isAuthenticated) fetchTelemetry();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <p>You are not authenticated.</p>;
  if (!user?.isAdmin) return <p>Only admins can access this page.</p>;
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded">
            <h2 className="text-xl">Users</h2>
            <p className="text-3xl">{data.users}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded">
            <h2 className="text-xl">Blog Posts</h2>
            <p className="text-3xl">{data.blogPosts}</p>
          </div>
          <div className="bg-purple-500 text-white p-4 rounded">
            <h2 className="text-xl">Projects</h2>
            <p className="text-3xl">{data.projects}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded">
            <h2 className="text-xl">Sessions</h2>
            <p className="text-3xl">{data.sessions}</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded">
            <h2 className="text-xl">Page Hits</h2>
            <p className="text-3xl">{data.pageHits}</p>
          </div>
        </div>
      ) : (
        <p>Loading telemetry data...</p>
      )}
    </div>
  );
}
