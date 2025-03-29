"use client"

import React, { useMemo } from 'react';
import { Document } from '@/models/Embeddings/Document';
import { DocumentEmbedding } from '@/models/Embeddings/DocumentEmbedding';

interface EmbeddingComparisonViewProps {
  documents: Document[];
  documentVectors: DocumentEmbedding[];
}

// Utility function for cosine similarity
const calculateCosineSimilarity = (vec1: number[], vec2: number[]): number => {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }

  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitude1 * magnitude2);
};

export const EmbeddingComparisonView: React.FC<EmbeddingComparisonViewProps> = ({ 
  documents,
  documentVectors 
}) => {

  const similarityMatrix = useMemo(() => {
    return documents.map((rowDoc) => {
      const rowVector = documentVectors.find(v => v.vectorId === rowDoc.vectorId)?.embedding;
      return documents.map((colDoc) => {
        const colVector = documentVectors.find(v => v.vectorId === colDoc.vectorId)?.embedding;
        
        if (!rowVector || !colVector) return 0;
        
        return calculateCosineSimilarity(rowVector, colVector);
      });

    });
  }, [documents, documentVectors]);

  return (
    <div className="shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Document Embedding Similarity Matrix</h2>
      </div>
      <div className="p-4 overflow-x-auto">
        <div 
          className="grid" 
          style={{ 
            gridTemplateColumns: `repeat(${documents.length + 1}, minmax(0, 1fr))`,
            gap: '2px'
          }}
        >
          {/* Header Row */}
          <div></div>
          {documents.map(doc => (
            <div key={doc._id} className="text-center p-2">
              <div className="text-sm font-medium">{doc.title}</div>
              <div className="text-xs text-gray-500 mt-1">({doc._id})</div>
            </div>
          ))}

          {/* Similarity Matrix */}
          {similarityMatrix.map((row, rowIndex) => (
            <React.Fragment key={documents[rowIndex]._id}>
              <div className="text-xs text-right pr-2 truncate p-1">
              <div className="text-sm font-medium">{documents[rowIndex].title}</div>
              <div className="text-xs text-gray-500 mt-1">({documents[rowIndex]._id})</div>                
              </div>
              {row.map((similarity, colIndex) => {
                // Generate color based on similarity (blue scale)
                const intensity = Math.floor(similarity * 255);
                return (
                  <div 
                    key={`${documents[rowIndex]._id}-${documents[colIndex]._id}`}
                    className="w-100 h-100 text-center items-center flex"
                    style={{ 
                      backgroundColor: `rgb(0, 0, ${intensity})`,
                      opacity: similarity > 0.8 ? 1 : 0.5
                    }}
                    title={`Similarity: ${similarity.toFixed(4)}`}
                  ><span className='flex-1'>{(similarity * 100).toFixed(2)}%</span></div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmbeddingComparisonView;