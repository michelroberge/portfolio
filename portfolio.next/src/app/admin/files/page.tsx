import { getAuthUser } from "@/services/authService";
import { fetchFiles, deleteFile } from "@/services/fileService";
import { FileInfo } from "@/models/FileInfo";
import Link from "next/link";

export default async function FileManagement() {
  const user = await getAuthUser();
  if (!user || !user.isAdmin) {
    return <p>You are not authorized to view this page.</p>;
  }

  const files = await fetchFiles();

  async function handleDelete(fileId : string) {
    "use server";
    await deleteFile(fileId);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">File Management</h1>
      <Link href="/admin/files/upload" className="bg-blue-500 text-white px-4 py-2 rounded">
        + Upload File
      </Link>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Filename</th>
            <th className="border p-2 text-left">Type</th>
            <th className="border p-2 text-left">Size</th>
            <th className="border p-2 text-left">Access</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file : FileInfo) => (
            <tr key={file._id} className="border">
              <td className="border p-2">{file.originalName}</td>
              <td className="border p-2">{file.contentType}</td>
              <td className="border p-2">{(file.size / 1024).toFixed(2)} KB</td>
              <td className="border p-2">
                {file.isPublic ? (
                  <a href={`/files/public/${file._id}`} className="text-blue-500 hover:underline">
                    Public Link
                  </a>
                ) : (
                  "Private"
                )}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(file._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
