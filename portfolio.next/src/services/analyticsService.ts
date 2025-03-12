// portfolio.next/src/services/analyticsService.ts
import { API_ENDPOINTS } from "@/lib/constants";

export interface TelemetryData {
  users: number;
  blogPosts: number;
  projects: number;
  sessions: number;
  pageHits: number;
}

/**
 * Fetches telemetry data from the API.
 * @returns TelemetryData if successful, null if error occurs
 */
export async function fetchTelemetry(): Promise<TelemetryData | null> {
  try {
    const res = await fetch(API_ENDPOINTS.analytics.telemetry, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch telemetry data");
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch telemetry:', err);
    return null;
  }
}
