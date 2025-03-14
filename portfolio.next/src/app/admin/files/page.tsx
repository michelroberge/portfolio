import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import AdminLayout from "@/components/layouts/AdminLayout";
import FileWrapper from "@/components/admin/FileWrapper";

export default async function FileManagement() {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Global Files Management</h1>
        <p>These files will be systematically included in the embedding contexts, unless they are media files (images, music, videos, etc.)</p>
        <FileWrapper context="general" entityId="0" cookieHeader={cookieHeader} />
      </div>
    </AdminLayout>
  );
}
