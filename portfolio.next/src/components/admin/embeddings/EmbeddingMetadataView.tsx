import React from 'react';
import { Document } from '@/models/Embeddings/Document';

interface EmbeddingsMetadataViewProps {
  documents: Document[];
}

export const EmbeddingsMetadataView: React.FC<EmbeddingsMetadataViewProps> = ({ 
  documents 
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Embeddings Metadata</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {documents.map((doc) => (
          <div 
            key={doc._id} 
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{doc.title}</h3>
              <span className="text-sm text-gray-500">{doc._id}</span>
            </div>
            <div className="mb-2">
              <strong>Vector ID:</strong> {doc.vectorId}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {doc.tags?.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            {doc.tags && Object.entries(doc.tags)
              .filter(([key]) => key !== 'tags')
              .map(([key, value]) => (
                <div key={key} className="text-sm text-gray-600 mt-1">
                  <strong>{key}:</strong> {JSON.stringify(value)}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmbeddingsMetadataView;