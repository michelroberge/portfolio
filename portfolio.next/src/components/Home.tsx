'use client';
import { useState } from 'react';
import { Project } from '@/models/Project';
import { BlogEntry } from '@/models/BlogEntry';
import Link from 'next/link';

interface HomeProps {
  blogEntries: BlogEntry[];
  projects: Project[];
}

export default function Home({ blogEntries, projects }: HomeProps) {
  const [showBlogs, setShowBlogs] = useState(true);
  const publishedProjects = projects.filter((project: Project) => !project.isDraft);
  const publishedBlogEntries = blogEntries.filter((blog: BlogEntry) => !blog.isDraft);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Mobile Toggle */}
      <div className="md:hidden mb-6">
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setShowBlogs(true)}
            aria-pressed={showBlogs}
            className={`flex-1 py-2 px-4 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showBlogs
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setShowBlogs(false)}
            aria-pressed={!showBlogs}
            className={`flex-1 py-2 px-4 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !showBlogs
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Projects
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Blog Posts Section - Hidden on mobile when projects are shown */}
        <section className={`md:w-2/3 ${!showBlogs ? 'hidden md:block' : ''}`}>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Latest Blog Posts</h2>
          <div className="space-y-6">
            {publishedBlogEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No blog posts available.
              </div>
            ) : (
              publishedBlogEntries.map((blog: BlogEntry) => (
                <div key={blog._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      <Link 
                        href={`/blogs/${blog.link}`} 
                        className="hover:text-blue-500 transition-colors focus:outline-none focus:text-blue-500"
                      >
                        {blog.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Projects Section - Hidden on mobile when blogs are shown */}
        <section className={`md:w-1/3 ${showBlogs ? 'hidden md:block' : ''}`}>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Projects</h2>
          <div className="space-y-6">
            {publishedProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No projects available.
              </div>
            ) : (
              publishedProjects.map((project: Project) => (
                <div key={project._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                      <Link 
                        href={`/projects/${project._id}`} 
                        className="hover:text-blue-500 transition-colors focus:outline-none focus:text-blue-500"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.excerpt}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.link && (
                      <div className="mt-4">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors focus:outline-none focus:text-blue-700 dark:focus:text-blue-300"
                        >
                          View Project
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
