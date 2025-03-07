// services/homePageService.ts
import { fetchBlogEntries, fetchProjects } from "./apiService";

export interface Project {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  link: string;
}

export interface BlogEntry {
  _id: string;
  title: string;
  date: string;
  excerpt: string;
  link: string;
}

export async function getHomePageData(): Promise<{ blogs: BlogEntry[]; projects: Project[] }> {
  try {
    const [blogs, projects] = await Promise.all([fetchBlogEntries(), fetchProjects()]);
    return { blogs, projects };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return { blogs: [], projects: [] }; // Fallback to avoid breaking the page
  }
}
 