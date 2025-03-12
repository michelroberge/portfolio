// portfolio.next/src/app/admin/projects/new/page.tsx

import { redirect } from "next/navigation";
import { getAuthUser } from "@/services/authService";
import EditProject from "@/components/admin/EditProject";

export default async function NewProjectPage() {
  const { authenticated, user } = await getAuthUser();

  if (!authenticated || !user?.isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <EditProject />
    </div>
  );
}
