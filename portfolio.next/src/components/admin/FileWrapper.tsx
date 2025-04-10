"use client";

import { useState, useCallback } from "react";
import UploadSpecificFile from "@/components/admin/UploadContextualFile";
import FileList from "@/components/admin/FileList";

interface FileWrapperProps {
  entityId: string;
  context: string;
  cookieHeader?: string;
}

export default function FileWrapper({ entityId, context, cookieHeader }: FileWrapperProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh file list
  const refreshFiles = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="p-4 border rounded mt-4">
      <h2 className="text-lg font-bold mb-2">Manage Files - {context}</h2>
      <UploadSpecificFile entityId={entityId} context={context} refreshFiles={refreshFiles} cookieHeader={cookieHeader} />
      <FileList key={refreshKey} entityId={entityId} context={context} refreshFiles={refreshFiles} cookieHeader={cookieHeader} />
    </div>
  );
}
