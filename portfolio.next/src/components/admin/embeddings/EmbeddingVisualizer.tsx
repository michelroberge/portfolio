"use client"
import React, { useState, useMemo } from 'react';
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
  selectedDocuments?: Document[]; // New prop for selected documents
}

export const EmbeddingWaveVisualizer: React.FC<EmbeddingWaveVisualizerProps> = ({ 
  documents,
  documentVectors,
  optionalEmbedding,
  selectedDocuments = [] // Default to empty array
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
    const dimensionCount = 100;

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
    // Check if document is in selectedDocuments
    const isSelected = selectedDocuments.some(doc => doc._id === documentId);
    if (isSelected) return 'green';

    // Check for high similarity if optional embedding is provided
    const highSimilarity = similarities.some(
      sim => sim.documentId === documentId && sim.similarity > 0.7
    );
    if (highSimilarity) return 'blue';

    return 'lightgray';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Embedding Wave Visualization</h2>
      
      <div className="w-full h-96 overflow-x-auto">
        <div className="flex flex-col h-full">
          {waveData.map((wave, waveIndex) => (
            <div 
              key={waveIndex} 
              className="flex items-center h-3 w-full relative"
            >
              {wave.wavePoints.map((point) => (
                <div
                  key={point.documentId}
                  className="h-full absolute"
                  style={{
                    width: '10px',
                    left: `${point.value * 100}%`,
                    backgroundColor: getDocumentColor(point.documentId),
                    opacity: selectedDocuments.length > 0 
                      ? (getDocumentColor(point.documentId) === 'green' ? 1 : 0.3)
                      : (getDocumentColor(point.documentId) === 'lightgray' ? 0.3 : 1)
                  }}
                />
              ))}
              
              {wave.optionalEmbeddingValue !== null && (
                <div 
                  className="absolute h-full w-1 bg-orange-500"
                  style={{
                    left: `${wave.optionalEmbeddingValue * 100}%`,
                    opacity: 0.7
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {similarities.length > 0 && (
          <div>
            <h3 className="font-semibold">Top Similar Documents:</h3>
            <ul>
              {similarities.slice(0, 3).map(sim => {
                const doc = documents.find(d => d._id === sim.documentId);
                return (
                  <li key={sim.documentId} className="text-sm">
                    {doc?.title} (Similarity: {sim.similarity.toFixed(4)})
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {selectedDocuments.length > 0 && (
          <div className="mt-2">
            <h3 className="font-semibold">Selected Documents:</h3>
            <ul>
              {selectedDocuments.map(doc => (
                <li key={doc._id} className="text-sm">
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