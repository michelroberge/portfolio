import { getAuthUser } from "@/services/authService";
import FileWrapper from "@/components/admin/FileWrapper";

export default async function FileManagement() {

  const user = await getAuthUser();
  if (!user || !user.isAdmin) {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Global Files Management</h1>
      <p>These files will be systematically included in the embedding contexts, unless they are media files (images, music, videos, etc.)</p>
      <FileWrapper context="general" entityId="0" />
    </div>
  );
}
