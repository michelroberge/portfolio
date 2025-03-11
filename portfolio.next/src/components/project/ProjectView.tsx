"use client";

import { Project } from "@/models/Project";
import { marked } from "marked";

export default function ProjectView({ project }: { project: Project }) {
  return (
    <main className="container mx-auto px-6 py-10 flex flex-col flex-1">
      <h1 className="text-3xl font-bold">{project.title}</h1>

      <div
        className="mt-4 prose lg:prose-lg xl:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: marked.parse(project.description) }}
      />
    </main>
  );
}
