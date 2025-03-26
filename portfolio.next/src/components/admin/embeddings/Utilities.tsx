import { Document } from "@/models/Embeddings/Document";
import { DocumentVector } from "@/models/Embeddings/DocumentVector";

export const calculateCosineSimilarity = (vec1: number[], vec2: number[]): number => {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same length');
    }
  
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  
    return dotProduct / (magnitude1 * magnitude2);
  };
  
  export const generateHeatmapColor = (similarity: number): string => {
    // Blue to yellow color scale based on similarity
    const hue = Math.floor(similarity * 120); // 0 (blue) to 120 (yellow)
    return `hsl(${hue}, 70%, 50%)`;
  };
  
  export const generateEmbeddingChartData = (
    documents: Array<{ id: string }>, 
    documentVectors: Array<{ vector: number[] }>,
    promptEmbedding?: number[] | null
  ) => {
    // Prepare data for line chart
    return documents[0].vector.map((_, dimIndex) => ({
      dimension: dimIndex,
      ...Object.fromEntries(
        documents.map((doc, index) => [doc.id, documentVectors[index].vector[dimIndex]])
      ),
      promptEmbedding: promptEmbedding ? promptEmbedding[dimIndex] : null
    }));
  };