"use client"
import React, { useState, useMemo, useCallback } from 'react';
import { Document } from '@/models/Embeddings/Document';
import { DocumentEmbedding } from '@/models/Embeddings/DocumentEmbedding';
import DocumentsView from "./DocumentView";
import EmbeddingVisualizer from "./EmbeddingVisualizer";
import EmbeddingComparisonView from "./EmbeddingComparisonView";
import EmbeddingsMetadataView from "./EmbeddingMetadataView";

interface CollectionPageClientProps {
  documents: Document[];
  collectionVectors: DocumentEmbedding[];
  name: string;
  onRegenerateEmbeddings: (ids: string[]) => Promise<void>;
}

export const CollectionPageClient: React.FC<CollectionPageClientProps> = ({
  documents,
  collectionVectors,
  name,
  onRegenerateEmbeddings
}) => {
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  // Memoize selected documents to prevent unnecessary re-renders
  const selectedDocuments = useMemo(() => 
    documents.filter(doc => selectedDocumentIds.includes(doc._id)), 
    [documents, selectedDocumentIds]
  );

  // Wrap handler in useCallback to maintain referential stability
  const handleDocumentSelection = useCallback((documentIds: string[]) => {
    setSelectedDocumentIds(documentIds);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{name} Collection</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>
        <DocumentsView 
          documents={documents} 
          onRegenerateEmbeddings={onRegenerateEmbeddings}
          onSelectionChange={handleDocumentSelection}
        />
        {documents.length > 0 && (
          <>
            <EmbeddingComparisonView 
              documents={documents} 
              documentVectors={collectionVectors} 
            />
            <EmbeddingVisualizer 
              documents={documents} 
              documentVectors={collectionVectors} 
              selectedDocuments={selectedDocuments}
            />
          </>
        )}
        {/* <EmbeddingsMetadataView documents={documents} /> */}
      </div>
    </div>
  );
};

export default CollectionPageClient;