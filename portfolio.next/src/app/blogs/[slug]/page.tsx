"use client";

import { useEffect, useState } from "react";

import { notFound, useParams } from "next/navigation";
import { BlogEntry, getBlog } from "@/services/blogService";
import { marked } from "marked";
import CommentSection from "@/components/CommentSection";

// interface BlogEntry {
//   _id: number;
//   title: string;
//   publishAt: string;
//   body: string;
//   excerpt?: string;
//   link: string;
// }

export default function BlogPage() {

  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogEntry|null>(null);

  useEffect(()=>{

    async function load(slug : string){
      const id = slug.toString().split("-").pop();
      console.log('slug', slug);
      console.log('id', id);
      if (!id) return notFound();
  
      const blog = await getBlog(id);
  
      setBlog(blog);
    }

    if ( slug){
      load(slug.toString());
    }

  }, [slug]); 

  if (!blog) return 
    (  <pre>
        loading...
      </pre>
    );

  return (
    <>
      <main className="container mx-auto px-6 py-10 flex flex-col flex-1">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        <p className="text-gray-500">
            {new Date(blog.publishAt).toLocaleString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
  
        {/* Wrap the Markdown content inside a "prose" div */}
        <div className="mt-4 prose lg:prose-lg xl:prose-xl max-w-none"
             dangerouslySetInnerHTML={{ __html: marked.parse(blog.body) }} />

        <CommentSection blogId={String(blog._id)} />

      </main>
    </>
  );
  
}
