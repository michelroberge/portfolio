// portfolio.next/src/app/admin/projects/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { protectAdminRoute } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditProject from "@/components/admin/EditProject";
import { fetchProject } from "@/services/projectService";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  // This will automatically redirect if not authenticated or not admin
  await protectAdminRoute();

  try {
    // Fetch project data server-side for SSR
    const project = await fetchProject(params.id);
    if (!project) return notFound();

    return (
      <AdminLayout>
        <EditProject initialProject={project} />
      </AdminLayout>
    );
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return notFound();
  }
}
