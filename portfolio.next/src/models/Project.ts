export interface BaseProject {
  title: string;
  excerpt: string;
  description: string;
  tags: string[];
  isDraft: boolean;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: string;
  endDate?: string;
  publishAt?: string | null;
  image?: string;
  link?: string;
  industry?: string;
  technologies: string[];
}

export interface Project extends BaseProject {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Create interface extends base but may have additional validation or defaults
export interface ProjectCreate extends BaseProject {
  publishAt?: string | null; // Make publishAt explicitly optional for create
  image?: string; // Ensure image is optional during creation
  startDate?: string; // Ensure startDate is optional during creation
  endDate?: string; // Ensure endDate is optional during creation
  technologies: string[]; // Ensure technologies is required during creation
}