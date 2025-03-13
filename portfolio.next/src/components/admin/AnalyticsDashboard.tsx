"use client";
import { useEffect, useState } from "react";
import { fetchTelemetry } from "@/services/analyticsService";
import { TelemetryData } from "@/models/Analytics";

export default function AnalyticsDashboard() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTelemetry();
  }, []);

  async function loadTelemetry() {
    try {
      const data = await fetchTelemetry();
      setTelemetry(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch analytics data");
      }
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!telemetry) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Page Views</h3>
          <p className="text-3xl">{telemetry.pageViews}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Unique Visitors</h3>
          <p className="text-3xl">{telemetry.uniqueVisitors}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
        <div className="space-y-2">
          {telemetry.topPages.map((page, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600">{page.path}</span>
              <span className="font-medium">{page.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
