// portfolio.next/src/app/admin/projects/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import EditProject from "@/components/admin/EditProject";
import { fetchProject } from "@/services/projectService";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  // This will automatically redirect if not authenticated or not admin
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  const { id } = await params;
  if (!id) return notFound();

  try {
    // Fetch project data server-side for SSR
    const project = await fetchProject(id, true, cookieHeader);
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
