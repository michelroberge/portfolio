"use client";

import { marked } from "marked";
// import CommentSection from "@/components/CommentSection";
import { BlogEntry } from "@/models/BlogEntry";

export default function BlogView({ blog }: { blog: BlogEntry }) {
  return ( 
    <main className="container prose mx-auto px-6 py-10 flex flex-col flex-1 bg-gray-50 mt-2">
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
        className="mt-4 prose lg:prose-lg xl:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: marked.parse(blog.body) }}
      />

      {/* Interactive comment section */}
      {/* <CommentSection blogId={String(blog._id)} /> */}
    </main>
  );
}
