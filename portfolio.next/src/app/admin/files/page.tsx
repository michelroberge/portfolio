import { getAuthUser } from "@/services/authService";
import FileWrapper from "@/components/admin/FileWrapper";

export default async function FileManagement() {

  const user = await getAuthUser();
  if (!user || !user.isAdmin) {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">File Management</h1>
      <FileWrapper context="general" entityId="0" />
    </div>
  );
}
