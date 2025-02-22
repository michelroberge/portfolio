"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchBlogEntries, fetchProjects } from "@/services/apiService";

interface Project {
  _id: string;
  title: string;
  description: string;
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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogEntries, setBlogEntries] = useState<BlogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"blog" | "portfolio">("blog");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const blogs = await fetchBlogEntries();
        setBlogEntries(blogs);
      } catch (error) {
        setError((error as Error).message);
        console.error("Error fetching blog entries:", error);
      }

      // If you wish to fetch projects from API instead of using mock data, uncomment:
      // try {
      //   const projectsData = await fetchProjects();
      //   setProjects(projectsData);
      // } catch (error) {
      //   console.error("Error fetching projects:", error);
      // }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-10 flex flex-col lg:flex-row lg:gap-8 flex-1">
        {/* Blog Section */}
        <section className="lg:flex-1">
          <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
          {error && <p className="text-red-500">Error: {error}</p>}
          <div className="space-y-4">
            {blogEntries.map((entry) => (
              <a
                key={`blog_${entry._id}`}
                href={`blogs/${entry.link}`}
                className="block bg-gray-100 p-4 rounded-sm hover:bg-gray-200 transition"
              >
                <h3 className="text-lg font-semibold">{entry.title}</h3>
                <p className="text-sm text-gray-500">{entry.date}</p>
                <p className="text-gray-600">{entry.excerpt}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Projects Sidebar */}
        <aside className="hidden lg:block lg:w-1/3 bg-white rounded-sm shadow-md p-4 h-fit">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <a
                key={`project${project._id}`}
                href={`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${project._id}`}
                className="block p-3 bg-gray-100 rounded-sm hover:bg-gray-200 transition"
              >
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </a>
            ))}
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
