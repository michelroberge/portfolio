import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto bg-default text-default">
      <h1 className="text-4xl font-semibold mb-4 text-primary">Admin Dashboard</h1>
      <p className="text-secondary mb-8">
        Welcome to the admin panel. Use the options below to manage your site.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {[
          { href: "/admin/blogs", title: "Manage Blogs", description: "Edit, create, and manage blog posts" },
          { href: "/admin/projects", title: "Manage Projects", description: "Edit, create, and manage projects" },
          { href: "/admin/comments", title: "Manage Comments", description: "Review and moderate user comments" },
          { href: "/admin/analytics", title: "Analytics Dashboard", description: "View site metrics and performance data" },
          { href: "/admin/settings/provider-config", title: "OAuth Provider Config", description: "Configure external identity providers" },
          { href: "/admin/users", title: "Manage Users", description: "Edit, create and manage users" },
          { href: "/admin/settings/ai-model", title: "AI Model", description: "Configure Artificial Intelligence Model" },
          { href: "/admin/files", title: "Global Files", description: "Manage the global files to include in context" },
          { href: "/admin/career", title: "Manage Timeline", description: "Add and update events on your timeline." },
          { href: "/admin/pages", title: "Manage Custom Pages", description: "Add and update Pages." },
          { href: "/admin/embeddings", title: "Refresh Embeddings", description: "Reset and update AI embeddings for blogs, projects, and files" },
          { href: "/admin/prompts", title: "Tune prompts", description: "Fine tune all prompts" },
          { href: "/admin/chatbot-history", title: "Chatbot History", description: "View chatbot history" }
        ].map(({ href, title, description }) => (
          <Link
            key={href}
            href={href}
            className="block p-4 border border-gray-200 dark:border-gray-700 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <h2 className="text-lg font-medium text-primary">{title}</h2>
            <p className="text-sm text-secondary">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}