import { notFound } from "next/navigation";
import { getProject } from "@/services/projectService";
import { Project } from "@/models/Project";
import ProjectView from "@/components/project/ProjectView";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) return notFound();

  try {
    const project: Project | null = await getProject(slug); // Fetch on the server
    if (!project) return notFound();
    return <ProjectView project={project} />;
  } catch (err) {
    console.error('Failed to fetch project:', err);
    return notFound();
  }
}
