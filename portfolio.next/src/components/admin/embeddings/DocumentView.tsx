"use client"
import React, { useState, useEffect } from 'react';
import { Document } from '@/models/Embeddings/Document';
import { useLoading } from '@/context/LoadingContext';
import { useTransition } from 'react';


interface DocumentsViewProps {
  documents: Document[];
  onRegenerateEmbeddings?: (ids: string[]) => Promise<void>;
  onSelectionChange?: (ids: string[]) => void; // New prop
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onRegenerateEmbeddings,
  onSelectionChange // Add this
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isPending) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isPending, showLoading, hideLoading]);

  // Notify parent component about selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedDocuments);
    }
  }, [selectedDocuments, onSelectionChange]);

  const toggleDocumentSelection = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleRegenerateSelected = async () => {
    startTransition(async () => {
      if (onRegenerateEmbeddings && selectedDocuments.length > 0) {
        await onRegenerateEmbeddings(selectedDocuments);
        setSelectedDocuments([]); // Clear selection after regeneration
      }
    });
  };

  return (
    <div className="shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Documents List</h2>
        {selectedDocuments.length > 0 && (
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={handleRegenerateSelected}
          >
            Regenerate Embeddings ({selectedDocuments.length})
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-600 border-b">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedDocuments.length === documents.length}
                  onChange={() =>
                    setSelectedDocuments(
                      selectedDocuments.length === documents.length
                        ? []
                        : documents.map(doc => doc._id)
                    )
                  }
                />
              </th>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Vector ID</th>
              <th className="p-3 text-left">Tags</th>
              <th className="p-3 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr
                key={doc._id}
                className="hover:bg-gray-500 border-b"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc._id)}
                    onChange={() => toggleDocumentSelection(doc._id)}
                  />
                </td>
                <td className="p-3">{doc._id}</td>
                <td className="p-3">{doc.title}</td>
                <td className="p-3">{doc.vectorId}</td>
                <td className="p-3 flex gap-2">
                  {doc.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}

                </td>
                <td className="p-3"><a href={doc.editLink}>Edit</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentsView; 