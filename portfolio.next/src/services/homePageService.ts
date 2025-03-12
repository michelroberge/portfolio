// services/homePageService.ts
import { BlogEntry } from '@/models/BlogEntry';
import { Project } from '@/models/Project';
import { API_ENDPOINTS } from '@/lib/constants';

export async function getHomePageData(): Promise<{ blogEntries: BlogEntry[]; projects: Project[] }> {
  try {
    console.log('📝 [SSR getHomePageData] Starting fetch', {
      blogUrl: API_ENDPOINTS.blog,
      projectUrl: API_ENDPOINTS.project
    });

    const [blogsRes, projectsRes] = await Promise.all([
      fetch(`${API_ENDPOINTS.blog}`, {
        headers: {
          'User-Agent': 'NextJS-SSR',
        },
        credentials: 'include'
      }),
      fetch(`${API_ENDPOINTS.project}`, {
        headers: {
          'User-Agent': 'NextJS-SSR',
        },
        credentials: 'include'
      })
    ]);

    // Log response status
    console.log('📝 [SSR getHomePageData] Fetch responses', {
      blogsStatus: blogsRes.status,
      projectsStatus: projectsRes.status,
      blogsStatusText: blogsRes.statusText,
      projectsStatusText: projectsRes.statusText
    });

    if (!blogsRes.ok || !projectsRes.ok) {
      // Log error details if responses aren't ok
      const blogsText = !blogsRes.ok ? await blogsRes.text() : 'OK';
      const projectsText = !projectsRes.ok ? await projectsRes.text() : 'OK';
      
      console.error('❌ [SSR getHomePageData] Fetch failed', {
        blogsStatus: blogsRes.status,
        projectsStatus: projectsRes.status,
        blogsError: blogsText,
        projectsError: projectsText
      });
      throw new Error('Failed to fetch homepage data');
    }

    const [blogEntries, projects] = await Promise.all([
      blogsRes.json(),
      projectsRes.json()
    ]);

    console.log('📝 [SSR getHomePageData] Successfully fetched data', {
      blogsCount: blogEntries.length,
      projectsCount: projects.length
    });

    return { blogEntries, projects };
  } catch (error) {
    console.error('❌ [SSR getHomePageData] Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return { blogEntries: [], projects: [] }; // Fallback to avoid breaking the page
  }
}