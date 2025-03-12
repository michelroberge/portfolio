import { getHomePageData } from "@/services/homePageService";
import Home from "@/components/Home"; // Move UI logic to a client component

export default async function Page() {
  const { blogEntries, projects } = await getHomePageData(); // Fetch on the server

  return <Home blogEntries={blogEntries} projects={projects} />;
}
