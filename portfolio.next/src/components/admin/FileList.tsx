"use client";

import { useState, useEffect } from "react";
import { fetchFiles, deleteFile } from "@/services/fileService";
import { FileInfo } from "@/models/FileInfo";
import { useAuth } from "@/context/AuthContext";

export default function FileList({ entityId, context, refreshFiles }: { 
  entityId: string; 
  context: string;
  refreshFiles: () => void; // ✅ Function to refresh file list
}) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function loadFiles() {
      try {
        const data = await fetchFiles(entityId, context);
        setFiles(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load files.");
      } finally {
        setLoading(false);
      }
    }
    loadFiles();
  }, [entityId, context]);

  async function handleDelete(fileId: string) {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await deleteFile(fileId);
      refreshFiles(); // ✅ Trigger a fresh fetch instead of manual filtering
    } catch (err) {
      console.error(err);
      alert("Failed to delete file.");
    }
  }

  if (loading) return <p>Loading files...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (files.length === 0) return <p>No files uploaded yet.</p>;

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-lg font-bold mb-2">Attached Files</h2>
      <ul className="space-y-2">
        {files.map((file) => (
          <li key={file._id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{file.filename}</p>
              <p className="text-sm text-gray-500">{file.contentType} • {Math.round(file.metadata.size / 1024)} KB</p>
              <p className={`text-sm ${file.metadata.isPublic ? "text-green-600" : "text-red-600"}`}>
                {file.metadata.isPublic ? "Public" : "Private"}
              </p>
            </div>
            <div>
              <a
                href={`/api/files/${file.metadata.isPublic ? "public" : "private"}/${file._id}`}
                target="_blank"
                className="px-3 py-1 text-blue-600 underline"
              >
                View
              </a>
              {user?.isAdmin && (
                <button
                  onClick={() => handleDelete(file._id)}
                  className="ml-3 px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
