const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchCareerTimeline() {
  const res = await fetch(`${apiUrl}/api/career/timeline`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch timeline data");
  return await res.json();
}

export async function fetchCareerEntry(id: string) {
  const res = await fetch(`${apiUrl}/api/career/timeline/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch entry");
  return await res.json();
}

export async function saveCareerEntry(entry: any) {
  const method = entry._id ? "PUT" : "POST";
  const url = entry._id ? `${apiUrl}/api/career/timeline/${entry._id}` : `${apiUrl}/api/career/timeline`;
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to save entry");
  return await res.json();
}

export async function deleteCareerEntry(id: string) {
  const res = await fetch(`${apiUrl}/api/career/timeline/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete entry");
}

export async function linkEntries(id: string, linkedIds: string[]) {
  const res = await fetch(`${apiUrl}/api/career/timeline/${id}/link`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ linkedEntries: linkedIds }),
  });
  if (!res.ok) throw new Error("Failed to link entries");
}

export async function parseLinkedInHTMLBackend(rawHTML: string) {
  const res = await fetch(`${apiUrl}/api/career/parse-linkedin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawHTML }),
  });
  if (!res.ok) throw new Error("Failed to parse LinkedIn data.");
  return await res.json();
}

export async function saveParsedJobs(parsedJobs: any[]) {
  const res = await fetch(`${apiUrl}/api/career/timeline/bulk`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedJobs),
  });
  if (!res.ok) throw new Error("Failed to save parsed jobs.");
  return await res.json();
}
