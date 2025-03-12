// services/homePageService.ts
import { BlogEntry } from '@/models/BlogEntry';
import { Project } from '@/models/Project';
import { API_ENDPOINTS } from '@/lib/constants';

export async function getHomePageData(): Promise<{ blogEntries: BlogEntry[]; projects: Project[] }> {
  try {
    const [blogsRes, projectsRes] = await Promise.all([
      fetch(`${API_ENDPOINTS.blog}`),
      fetch(`${API_ENDPOINTS.project}`)
    ]);

    if (!blogsRes.ok || !projectsRes.ok) {
      throw new Error('Failed to fetch homepage data');
    }

    const [blogEntries, projects] = await Promise.all([
      blogsRes.json(),
      projectsRes.json()
    ]);

    return { blogEntries, projects };
  } catch (error) {
    console.error(error);
    return { blogEntries: [], projects: [] }; // Fallback to avoid breaking the page
  }
}