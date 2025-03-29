"use client"
import React, {  useMemo } from 'react';
import { Document } from '@/models/Embeddings/Document';
import { DocumentEmbedding } from '@/models/Embeddings/DocumentEmbedding';

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

interface EmbeddingWaveVisualizerProps {
  documents: Document[];
  documentVectors: DocumentEmbedding[];
  optionalEmbedding?: number[];
  selectedDocuments?: Document[];
}

export const EmbeddingWaveVisualizer: React.FC<EmbeddingWaveVisualizerProps> = ({ 
  documents,
  documentVectors,
  optionalEmbedding,
  selectedDocuments = []
}) => {
  // Normalize embeddings to a common scale
  const normalizeEmbedding = (embedding: number[]) => {
    const min = Math.min(...embedding);
    const max = Math.max(...embedding);
    return embedding.map(val => (val - min) / (max - min));
  };

  // Calculate similarities if optional embedding is provided
  const similarities = useMemo(() => {
    if (!optionalEmbedding) return [];

    return documentVectors.map((docVector, index) => ({
      documentId: documents[index]._id,
      similarity: calculateCosineSimilarity(optionalEmbedding, docVector.embedding)
    })).sort((a, b) => b.similarity - a.similarity);
  }, [optionalEmbedding, documentVectors, documents]);

  // Prepare wave data
  const waveData = useMemo(() => {
    if (documentVectors.length === 0) return [];

    // Take the first 100 dimensions for visualization (to keep it readable)
    const dimensionCount = 256;

    return Array.from({ length: dimensionCount }, (_, dimIndex) => {
      const wavePoints = documentVectors.map((docVector, docIndex) => ({
        documentId: documents[docIndex]?._id,
        value: normalizeEmbedding(docVector.embedding)[dimIndex]
      }));

      return {
        dimension: dimIndex,
        wavePoints,
        optionalEmbeddingValue: optionalEmbedding 
          ? normalizeEmbedding(optionalEmbedding)[dimIndex] 
          : null
      };
    });
  }, [documentVectors, documents, optionalEmbedding]);

  // Determine document colors based on selection and similarities
  const getDocumentColor = (documentId: string) => {
    const isSelected = selectedDocuments.some(doc => doc._id === documentId);
    if (isSelected) return 'bg-green-500';

    const highSimilarity = similarities.some(
      sim => sim.documentId === documentId && sim.similarity > 0.7
    );
    if (highSimilarity) return 'bg-blue-500';

    return 'dark:bg-gray-200 bg-gray-400';
  };

  return (
    <div className="shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Embedding Wave Visualization</h2>
      
      <div className="w-full h-64 relative">
        <div className="absolute inset-0 flex">
          {waveData.map((wave, waveIndex) => (
            <div key={waveIndex} 
              className="flex-1 relative"
            >
              {wave.wavePoints.map((point) => (
                <div
                  key={point.documentId}
                  className="absolute w-full"
                  style={{
                    height: '4px',
                    bottom: `${point.value * 100}%`,
                    opacity: selectedDocuments.length > 0 
                      ? (getDocumentColor(point.documentId).includes('green') ? 1 : 0.3)
                      : (getDocumentColor(point.documentId).includes('gray') ? 0.3 : 1)
                  }}
                >
                  <div 
                    className={`h-full ${getDocumentColor(point.documentId)} rounded-full`}
                  />
                </div>
              ))}
              
              {wave.optionalEmbeddingValue !== null && (
                <div 
                  className="absolute w-full"
                  style={{
                    height: '2px',
                    bottom: `${wave.optionalEmbeddingValue * 100}%`,
                  }}
                >
                  <div className="h-full bg-orange-500 rounded-full opacity-70" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {similarities.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Top Similar Documents:</h3>
            <ul className="space-y-1">
              {similarities.slice(0, 3).map(sim => {
                const doc = documents.find(d => d._id === sim.documentId);
                return (
                  <li 
                    key={sim.documentId} 
                    className="text-sm flex justify-between"
                  >
                    <span className="truncate">{doc?.title}</span>
                    <span className="text-gray-500 ml-2">
                      {sim.similarity.toFixed(4)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {selectedDocuments.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Selected Documents:</h3>
            <ul className="space-y-1">
              {selectedDocuments.map(doc => (
                <li 
                  key={doc._id} 
                  className="text-sm truncate"
                >
                  {doc.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddingWaveVisualizer;