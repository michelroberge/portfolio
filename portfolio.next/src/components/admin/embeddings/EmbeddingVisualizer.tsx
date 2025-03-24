import React, { useEffect, useRef } from 'react';
import { Document } from '@/models/Embeddings/Document';

interface EmbeddingVisualizerProps {
  documents: Document[];
  width?: number;
  height?: number;
}

const EmbeddingVisualizer: React.FC<EmbeddingVisualizerProps> = ({
  documents,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // This is a simplified 2D visualization 
  // In a real implementation, you would use t-SNE or UMAP to reduce dimensions
  useEffect(() => {
    if (!canvasRef.current || documents.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // In a real implementation, you would have already reduced dimensions
    // Here, we'll just use the first 2 dimensions of each vector for demonstration
    documents.forEach((doc, index) => {
      if (!doc.embedding?.vector || doc.embedding.vector.length < 2) return;
      
      // Normalize to canvas size (this is very simplified)
      const x = (doc.embedding.vector[0] + 1) * width / 2;
      const y = (doc.embedding.vector[1] + 1) * height / 2;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = getCollectionColor(doc.collection);
      ctx.fill();
      
      // Draw label on hover (would need event handlers in real implementation)
      ctx.fillStyle = '#333';
      ctx.fillText(doc.title.substring(0, 20), x + 8, y);
    });
  }, [documents, width, height]);
  
  // Generate a color based on collection name (simple hash)
  const getCollectionColor = (collection: string): string => {
    let hash = 0;
    for (let i = 0; i < collection.length; i++) {
      hash = collection.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return `#${'00000'.substring(0, 6 - c.length)}${c}`;
  };
  
  if (documents.length === 0) {
    return <div className="p-4 text-center">No documents to visualize</div>;
  }
  
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Embedding Visualization</h2>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border"
        />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Note: This is a simplified 2D projection of high-dimensional embeddings.</p>
        <p>In a production environment, use t-SNE or UMAP for better visualization.</p>
      </div>
    </div>
  );
};

export default EmbeddingVisualizer;