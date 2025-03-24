import React, { useState } from 'react';
import Link from 'next/link';
import { Document } from '@/models/Embeddings/Document';

interface DocumentTableProps {
  documents: Document[];
  isLoading: boolean;
  onRegenerateSelected: (ids: string[]) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  documents, 
  isLoading,
  onRegenerateSelected
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  
  const toggleSelectAll = () => {
    if (selectedIds.length === documents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(documents.map(doc => doc._id));
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading documents...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button 
            disabled={selectedIds.length === 0}
            onClick={() => onRegenerateSelected(selectedIds)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Regenerate Selected Embeddings
          </button>
        </div>
        <div>
          {selectedIds.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedIds.length} document(s) selected
            </span>
          )}
        </div>
      </div>
      
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">
              <input 
                type="checkbox" 
                checked={selectedIds.length === documents.length && documents.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="p-3 border text-left">Title</th>
            <th className="p-3 border text-left">Embedding Model</th>
            <th className="p-3 border text-left">Vector ID</th>
            <th className="p-3 border text-left">Last Updated</th>
            <th className="p-3 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc._id} className="hover:bg-gray-50">
              <td className="p-3 border">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(doc._id)}
                  onChange={() => toggleSelect(doc._id)}
                />
              </td>
              <td className="p-3 border">
                <Link href={`/embeddings/documents/${doc._id}`} className="text-blue-600 hover:underline">
                  {doc.title}
                </Link>
              </td>
              <td className="p-3 border">{doc.embedding.model} v{doc.embedding.version}</td>
              <td className="p-3 border">{doc.embedding.vectorId}</td>
              <td className="p-3 border">{new Date(doc.embedding.updatedAt).toLocaleString()}</td>
              <td className="p-3 border">
                <button 
                  onClick={() => onRegenerateSelected([doc._id])}
                  className="px-2 py-1 bg-blue-600 text-white text-sm rounded"
                >
                  Regenerate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;