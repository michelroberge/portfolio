"use client";

interface SectionToggleProps {
  activeSection: "blogs" | "projects";
  setActiveSection: (section: "blogs" | "projects") => void;
}

export default function SectionToggle({ activeSection, setActiveSection }: SectionToggleProps) {
  return (
    <div className="flex md:hidden justify-center mb-4 border-b">
      <button
        type="button"
        className={`w-1/2 p-2 text-center ${
          activeSection === "blogs" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
        }`}
        onClick={() => setActiveSection("blogs")}
      >
        Blogs
      </button>
      <button
        type="button"
        className={`w-1/2 p-2 text-center ${
          activeSection === "projects" ? "border-b-2 border-blue-500 font-bold" : "text-gray-500"
        }`}
        onClick={() => setActiveSection("projects")}
      >
        Projects
      </button>
    </div>
  );
}
