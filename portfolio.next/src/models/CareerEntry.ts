export interface BaseCareerEntry {
  title: string;
  company: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string | null;
  skills: string[];
  highlights?: string[];
  url?: string;
  importedFromLinkedIn?: boolean;
}

export interface CareerEntry extends BaseCareerEntry {
  _id: string | undefined;
  type: 'job' | 'education' | 'certification';
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CareerEntryCreate extends BaseCareerEntry {
  type: 'job' | 'education' | 'certification';
}

// Helper function to create a CareerEntry from LinkedIn data
export function createCareerEntryFromLinkedIn(linkedInData: {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  skills: string[];
  linkedInUrl?: string;
}): CareerEntryCreate {
  return {
    ...linkedInData,
    type: 'job',
    url: linkedInData.linkedInUrl,
    highlights: [],
    importedFromLinkedIn: true,
  };
}
