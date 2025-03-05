"use client";

import { useState } from "react";
import SectionToggle from "@/components/SectionToggle";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  link: string;
}

interface BlogEntry {
  _id: string;
  title: string;
  date: string;
  excerpt: string;
  link: string;
}

export default function Home({ blogs, projects }: { blogs: BlogEntry[]; projects: Project[] }) {
  const [activeSection, setActiveSection] = useState<"blogs" | "projects">("blogs");

  return (
    <div className="flex flex-col min-h-screen">
      <SectionToggle activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="mx-auto w-full px-6 py-10 flex flex-col lg:flex-row lg:gap-8 flex-1 max-w-screen-2xl">
        {/* Blogs Section */}
        <section className={`${activeSection === "blogs" ? "block" : "hidden"} md:block lg:flex-1`}>
          <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
          <div className="space-y-4">
            {blogs.map((entry) => (
              <a key={`blog_${entry._id}`} href={`blogs/${entry.link}`} className="block bg-gray-100 p-4 rounded-sm hover:bg-gray-200 transition">
                <h3 className="text-lg font-semibold">{entry.title}</h3>
                <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleString()}</p>
                <p className="text-gray-600">{entry.excerpt}</p>
              </a>
            ))}
          </div>
        </section>
        {/* Projects Section */}
        <aside className={`${activeSection === "projects" ? "block" : "hidden"} md:block lg:w-1/3 bg-white rounded-sm shadow-md p-4 h-fit`}>
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <a key={`project_${project._id}`} href={project.link} className="flex items-center p-3 bg-gray-100 rounded-sm hover:bg-gray-200 transition">
                {project.image && <Image src={project.image} alt={project.title} className="max-h-12 object-cover mr-4 rounded" width={64} height={64} />}
                <div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
