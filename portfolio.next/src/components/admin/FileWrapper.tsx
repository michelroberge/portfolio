"use client";

import { useState, useCallback } from "react";
import UploadSpecificFile from "@/components/admin/UploadContextualFile";
import FileList from "@/components/admin/FileList";

export default function FileWrapper({ entityId, context }: { entityId: string; context: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Function to refresh file list
  const refreshFiles = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-lg font-bold mb-2">Manage Files</h2>
      <UploadSpecificFile entityId={entityId} context={context} refreshFiles={refreshFiles} />
      <FileList key={refreshKey} entityId={entityId} context={context} refreshFiles={refreshFiles} />
    </div>
  );
}
