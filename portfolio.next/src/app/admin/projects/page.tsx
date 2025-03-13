import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProjectList from "@/components/admin/ProjectList";
import { fetchProjects } from "@/services/projectService";

export default async function ProjectManagementPage() {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  // Fetch projects server-side for SSR
  const projects = await fetchProjects();

  return (
    <AdminLayout>
      <ProjectList initialProjects={projects} />
    </AdminLayout>
  );
}
