"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Project, getProject } from "@/services/projectService";
import { marked } from "marked";

export default function ProjectPage() {

  const { id } = useParams();
  const [project, setProject] = useState<Project|null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{

    async function load(id : string){
      if (!id) return notFound();
  
      const project = await getProject(id);
  
      setProject(project);
      setLoading(false);
    }

    if ( id && loading){
      load(id.toString());
    }

  }, [id]); 

  if ( loading){
    return (
      <p>Loading...</p>
    )
  }
  if (!project) return 
    (  
      <></>
    );

  return (
    <>
      <main className="container mx-auto px-6 py-10 flex flex-col flex-1">
        <h1 className="text-3xl font-bold">{project.title}</h1>

        <div className="mt-4 prose lg:prose-lg xl:prose-xl max-w-none"
             dangerouslySetInnerHTML={{ __html: marked.parse(project.description) }} />

      </main>
    </>
  );
  
}
