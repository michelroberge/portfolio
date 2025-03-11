import { ParsedJob } from "@/models/ParsedJob";
import { API_ENDPOINTS } from "@/lib/constants";

export interface CareerEntry {
  _id?: string;
  title: string;
  company?: string;
  startDate: string;
  endDate?: string | null;
  location?: string;
  description: string;
  skills: string[];
  linkedEntries: string[];
  importedFromLinkedIn: boolean;
}

export async function fetchCareerTimeline() {
  const res = await fetch(`${API_ENDPOINTS.career}/timeline`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch timeline data");
  return await res.json();
}

export async function fetchCareerEntry(id: string) {
  const res = await fetch(`${API_ENDPOINTS.career}/timeline/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch entry");
  return await res.json();
}

export async function saveCareerEntry(entry: CareerEntry) {
  const method = entry._id ? "PUT" : "POST";
  const url = entry._id ? `${API_ENDPOINTS.career}/timeline/${entry._id}` : `${API_ENDPOINTS.career}/timeline`;
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res || !res.ok) throw new Error("Failed to save entry");
  return await res.json();
}

export async function deleteCareerEntry(id: string) {
  const res = await fetch(`${API_ENDPOINTS.career}/timeline/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete entry");
}

export async function linkEntries(id: string, linkedIds: string[]) {
  const res = await fetch(`${API_ENDPOINTS.career}/timeline/${id}/link`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ linkedEntries: linkedIds }),
  });
  if (!res.ok) throw new Error("Failed to link entries");
}

export async function parseLinkedInHTMLBackend(rawHTML: string) {
  const res = await fetch(`${API_ENDPOINTS.career}/parse-linkedin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawHTML }),
  });
  if (!res.ok) throw new Error("Failed to parse LinkedIn data.");
  return await res.json();
}

export async function saveParsedJobs(parsedJobs: ParsedJob[]) {
  const res = await fetch(`${API_ENDPOINTS.career}/timeline/bulk`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedJobs),
  });
  if (!res.ok) throw new Error("Failed to save parsed jobs.");
  return await res.json();
}
