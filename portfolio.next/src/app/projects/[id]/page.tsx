import { notFound } from "next/navigation";
import { getProject } from "@/services/projectService";
import { Project } from "@/models/Project";
import ProjectView from "@/components/ProjectView";

export default async function ProjectPage({ params }: { params: Promise<{ id: string } >}) {
  const {id} = await params;

  if (!id) return notFound();

  const project: Project | null = await getProject(id); // Fetch on the server

  if (!project) return notFound();

  return <ProjectView project={project} />;
}
