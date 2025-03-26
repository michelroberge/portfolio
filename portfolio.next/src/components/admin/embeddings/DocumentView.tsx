"use client"
import React, { useState } from 'react';
import { Document } from '@/models/Embeddings/Document';

interface DocumentsViewProps {
  documents: Document[];
  onRegenerateEmbeddings?: (ids: string[]) => Promise<void>;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ 
  documents, 
  onRegenerateEmbeddings 
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const toggleDocumentSelection = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleRegenerateSelected = async () => {
    if (onRegenerateEmbeddings && selectedDocuments.length > 0) {
      await onRegenerateEmbeddings(selectedDocuments);
      setSelectedDocuments([]); // Clear selection after regeneration
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
            <tr className="bg-gray-100 border-b">
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
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr 
                key={doc._id} 
                className="hover:bg-gray-50 border-b"
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
                <td className="p-3">
                  {/* <div className="flex flex-wrap gap-1">
                    {doc.metadata.map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentsView;