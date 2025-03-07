"use client"
import { useState } from "react";
import { uploadFile } from "@/services/fileService";

export default function UploadSpecificFile({ entityId, context }: { entityId: string; context: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await uploadFile(file, entityId, context, isPublic);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-lg font-bold mb-2">Attach a File</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 border rounded"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
            className="mr-2"
          />
          Make file public
        </label>
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-500"}`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
