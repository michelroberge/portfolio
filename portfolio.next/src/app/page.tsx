"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

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
    const mockProjects: Project[] = [
      { _id: "1", title: "Portfolio Next", description: "My personal portfolio built with Next.js.", image: "/project1.jpg", link: "/projects/portfolio-next" },
      { _id: "2", title: "Licensing System", description: "A modular monolith licensing mechanism.", image: "/project2.jpg", link: "/projects/licensing" },
      { _id: "3", title: "Identity Server", description: "OIDC-based authentication system.", image: "/project3.jpg", link: "/projects/identity" },
    ];
    
    const fetchBlogEntries = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
        if (!response.ok) {
          throw new Error(`Failed to fetch blog entries: ${response.statusText}`);
        }
        const data: BlogEntry[] = await response.json();
        setBlogEntries(data);
      } catch (error) {
        setError((error as Error).message);
        console.error("Error fetching blog entries:", error);
      }
    };

    setProjects(mockProjects);
    fetchBlogEntries();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-10 flex flex-col lg:flex-row lg:gap-8 flex-1">
        {/* Main Content */}
        <section className="lg:flex-1">
          {/* Toggle for Small Screens */}
          <div className="lg:hidden flex justify-center mb-6">
            <button
              className={`px-4 py-2 rounded-l-sm ${activeTab === "blog" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab("blog")}
            >
              Blog
            </button>
            <button
              className={`px-4 py-2 rounded-r-sm ${activeTab === "portfolio" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab("portfolio")}
            >
              Portfolio
            </button>
          </div>

          {/* Blog Section (Only Show on Large or When Active) */}
          <section className={activeTab === "blog" || window.innerWidth >= 1024 ? "block" : "hidden"}>
            <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
            {error && <p className="text-red-500">Error: {error}</p>}
            <div className="space-y-4">
              {blogEntries.map((entry) => (
                <a  key={`blog_${entry._id}`} 
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
        </section>

        {/* Projects Sidebar (Large Screens) */}
        <aside className="hidden lg:block lg:w-1/3 bg-white rounded-sm shadow-md p-4 h-fit">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <a  key={`project${project._id}`} 
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${project._id}`} 
                  className="block p-3 bg-gray-100 rounded-sm hover:bg-gray-200 transition">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </a>
            ))}
          </div>
        </aside>

        {/* Projects List for Small Screens */}
        <section className={`lg:hidden ${activeTab === "portfolio" ? "block" : "hidden"}`}>
          <h2 className="text-2xl font-semibold mb-6">Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <a  key={`project${project._id}`} 
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${project._id}`} 
                  className="block p-3 bg-gray-100 rounded-sm hover:bg-gray-200 transition">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.description}</p>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-6">
        <p>&copy; {new Date().getFullYear()} michel-roberge.com. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
