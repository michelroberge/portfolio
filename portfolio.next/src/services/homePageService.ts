// services/homePageService.ts
import { BlogEntry } from '@/models/BlogEntry';
import { Project } from '@/models/Project';
import { PUBLIC_API } from '@/lib/constants';

/**
 * Get home page data including blogs and projects
 */
export async function getHomePageData(): Promise<{ blogEntries: BlogEntry[]; projects: Project[] }> {
  try {
    const [blogsRes, projectsRes] = await Promise.all([
      fetch(PUBLIC_API.blog.list, {
        credentials: "include",
      }),
      fetch(PUBLIC_API.project.list, {
        credentials: "include",
      })
    ]);

    if (!blogsRes.ok || !projectsRes.ok) {
      const error = !blogsRes.ok ? await blogsRes.json() : await projectsRes.json();
      throw new Error(error.message || "Failed to fetch homepage data");
    }

    const [blogEntries, projects] = await Promise.all([
      blogsRes.json(),
      projectsRes.json()
    ]);

    return { blogEntries, projects };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    throw error;
  }
}