import { type CareerEntry, type CareerEntryCreate, createCareerEntryFromLinkedIn } from "@/models/CareerEntry";
import { API_ENDPOINTS } from "@/lib/constants";

/**
 * Fetches the career timeline data from the API.
 * 
 * @returns A promise that resolves to an array of CareerEntry objects.
 */
export async function fetchCareerTimeline(): Promise<CareerEntry[]> {
  const res = await fetch(`${API_ENDPOINTS.career}/timeline`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch timeline data");
  return await res.json();
}

/**
 * Fetches a single career entry by ID from the API.
 * 
 * @param id The ID of the career entry to fetch.
 * @returns A promise that resolves to a CareerEntry object.
 */
export async function fetchCareerEntry(id: string): Promise<CareerEntry> {
  const res = await fetch(`${API_ENDPOINTS.career}/timeline/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch entry");
  return await res.json();
}

/**
 * Saves a career entry to the API.
 * 
 * If the entry has an _id property, it will be updated via a PUT request.
 * Otherwise, it will be created via a POST request.
 * 
 * @param entry The career entry to save.
 * @returns A promise that resolves to the saved CareerEntry object.
 */
export async function saveCareerEntry(entry: CareerEntryCreate | (CareerEntry & { _id: string })): Promise<CareerEntry> {
  const method = '_id' in entry ? "PUT" : "POST";
  const url = '_id' in entry ? `${API_ENDPOINTS.career}/timeline/${entry._id}` : `${API_ENDPOINTS.career}/timeline`;
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res || !res.ok) throw new Error("Failed to save entry");
  return await res.json();
}

/**
 * Deletes a career entry by ID from the API.
 * 
 * @param id The ID of the career entry to delete.
 */
export async function deleteCareerEntry(id: string): Promise<void> {
  const res = await fetch(`${API_ENDPOINTS.career}/timeline/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete entry");
}

/**
 * Links multiple career entries together.
 * 
 * @param id The ID of the career entry to link to.
 * @param linkedIds The IDs of the career entries to link.
 */
export async function linkEntries(id: string, linkedIds: string[]): Promise<void> {
  const res = await fetch(`${API_ENDPOINTS.career}/timeline/${id}/link`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ linkedEntries: linkedIds }),
  });
  if (!res.ok) throw new Error("Failed to link entries");
}

/**
 * Interface for data parsed from LinkedIn HTML.
 */
export interface LinkedInParseResult {
  /**
   * The title of the job.
   */
  title: string;
  /**
   * The company name.
   */
  company: string;
  /**
   * The location of the job.
   */
  location: string;
  /**
   * The start date of the job.
   */
  startDate: string;
  /**
   * The end date of the job, or null if it's still ongoing.
   */
  endDate: string | null;
  /**
   * The job description.
   */
  description: string;
  /**
   * The skills required for the job.
   */
  skills: string[];
  /**
   * The URL of the LinkedIn job posting, if available.
   */
  linkedInUrl?: string;
}

/**
 * Parses LinkedIn HTML data on the backend.
 * 
 * @param rawHTML The raw HTML data from LinkedIn.
 * @returns A promise that resolves to an array of LinkedInParseResult objects.
 */
export async function parseLinkedInHTMLBackend(rawHTML: string): Promise<LinkedInParseResult[]> {
  const res = await fetch(`${API_ENDPOINTS.career}/parse-linkedin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawHTML }),
  });
  if (!res.ok) throw new Error("Failed to parse LinkedIn data.");
  return await res.json();
}

/**
 * Saves parsed LinkedIn jobs to the API.
 * 
 * @param parsedJobs The parsed LinkedIn jobs to save.
 * @returns A promise that resolves to an array of CareerEntry objects.
 */
export async function saveParsedJobs(parsedJobs: LinkedInParseResult[]): Promise<CareerEntry[]> {
  // Convert LinkedIn data directly to CareerEntries
  const careerEntries = parsedJobs.map(createCareerEntryFromLinkedIn);
  
  const res = await fetch(`${API_ENDPOINTS.career}/timeline/bulk`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(careerEntries),
  });
  if (!res.ok) throw new Error("Failed to save parsed jobs.");
  return await res.json();
}
