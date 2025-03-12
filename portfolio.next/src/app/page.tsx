export const dynamic = 'force-dynamic';
import { getHomePageData } from "@/services/homePageService";
import Home from "@/components/Home"; // Move UI logic to a client component

export default async function Page() {
  console.log('🔍 [DEBUG] Root Page Component Starting');
  
  try {
    const { blogEntries, projects } = await getHomePageData(); // Fetch on the server
    
    console.log('🔍 [DEBUG] Root Page Data Fetched:', {
      blogsCount: blogEntries?.length ?? 0,
      projectsCount: projects?.length ?? 0
    });

    return <Home blogEntries={blogEntries} projects={projects} />;
  } catch (error) {
    console.error('❌ [ERROR] Root Page Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Following our SSR pattern memory, still render the page but with empty data
    return <Home blogEntries={[]} projects={[]} />;
  }
}
