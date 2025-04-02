"use client";

import { marked } from "marked";
// import CommentSection from "@/components/CommentSection";
import { BlogEntry } from "@/models/BlogEntry";

export default function BlogView({ blog }: { blog: BlogEntry }) {
  return ( 
    <main className="max-w-fit lg:prose-lg xl:prose-xl mx-auto p-6 flex flex-col flex-1">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <p className="">
        {blog.publishAt && new Date(blog.publishAt).toLocaleString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>

      {/* Markdown rendering */}
      <div
        className="prose 
        dark:prose-headings:text-gray-300
        dark:prose-p:text-gray-400 
        dark:prose-a:text-blue-400 
        dark:prose-li:text-gray-500 
        dark:prose-strong:text-gray-400
        p-2 lg:prose-lg xl:prose-xl max-w-fit" 
      dangerouslySetInnerHTML={{ __html: marked.parse(blog.body) }}
      />

      {/* Interactive comment section */}
      {/* <CommentSection blogId={String(blog._id)} /> */}
    </main>
  );
}
