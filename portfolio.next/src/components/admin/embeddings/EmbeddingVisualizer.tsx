import React, { useState } from 'react';
import { Document } from '@/models/Embeddings/Document';
import { DocumentVector } from '@/models/Embeddings/DocumentVector';

interface EmbeddingVisualizerProps {
  documents: Document[];
  documentVectors: DocumentVector[];
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

export const EmbeddingVisualizer: React.FC<EmbeddingVisualizerProps> = ({ 
  documents,
  documentVectors 
}) => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [promptEmbedding, setPromptEmbedding] = useState<number[] | null>(null);
  const [similarDocuments, setSimilarDocuments] = useState<string[]>([]);

  const handleAnalyzePrompt = async () => {
    // Simulated prompt embedding generation
    const simulatedPromptEmbedding = Array.from({ length: 4096 }, () => Math.random() * 2 - 1);
    setPromptEmbedding(simulatedPromptEmbedding);

    // Calculate similarities and find top similar documents
    const similarities = documentVectors.map((docVector, index) => ({
      documentId: documents[index]._id,
      similarity: calculateCosineSimilarity(simulatedPromptEmbedding, docVector.vector)
    })).sort((a, b) => b.similarity - a.similarity);

    // Select top 3 similar documents
    const topSimilarDocIds = similarities
      .slice(0, 3)
      .map(sim => sim.documentId);
    
    setSimilarDocuments(topSimilarDocIds);
  };

  // Prepare data for visualization
  const chartData = documents[0].vectorId ? 
    Array.from({ length: 4096 }, (_, dimIndex) => ({
      dimension: dimIndex,
      ...Object.fromEntries(
        documents.map((doc, index) => [doc._id, documentVectors[index].vector[dimIndex]])
      ),
      promptEmbedding: promptEmbedding ? promptEmbedding[dimIndex] : null
    })) : 
    [];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Embedding Visualization</h2>
      </div>
      <div className="p-4">
        <div className="flex space-x-2 mb-4">
          <input 
            type="text"
            placeholder="Enter prompt for embedding analysis"
            className="flex-grow border rounded px-3 py-2"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
          />
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAnalyzePrompt}
          >
            Analyze Prompt
          </button>
        </div>

        {/* Simple line chart representation */}
        <div className="w-full h-64 border rounded relative">
          <div className="absolute inset-0 overflow-hidden">
            {chartData.length > 0 && documents.map((doc, docIndex) => (
              <div 
                key={doc._id}
                className="absolute w-full h-1"
                style={{
                  top: `${(docIndex / documents.length) * 100}%`,
                  backgroundColor: similarDocuments.includes(doc._id) ? 'blue' : 'lightgray',
                  opacity: similarDocuments.includes(doc._id) ? 1 : 0.5
                }}
              />
            ))}
            {promptEmbedding && (
              <div 
                className="absolute w-full h-2 bg-orange-500"
                style={{
                  top: '50%',
                  opacity: 0.7
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddingVisualizer;