import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import React from 'react';
import Link from 'next/link';

import embeddingService from "@/services/embeddingService";
import EmbeddingVisualizer from "@/components/admin/embeddings/EmbeddingVisualizer";
import DocumentsView from "@/components/admin/embeddings/DocumentView";
import EmbeddingComparisonView from "@/components/admin/embeddings/EmbeddingComparisonView";
import EmbeddingsMetadataView from "@/components/admin/embeddings/EmbeddingMetadataView";

interface Props {
  params: { name: string };
}

export default async function CollectionPage({ params }: Props) {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);
  const { name } = await params;

  let documents = await embeddingService.fetchDocuments(name, cookieHeader, () => { });
  if (!documents) documents = [];
  const collectionVectors = await embeddingService.fetchCollectionVectors(name, cookieHeader);
  const searchVector = undefined; //await embeddingService.getSearchVector(query);

  const handleRegenerateSelected = async (ids: string[]) => {
    'use server';
    // Implement server action for regenerating embeddings
    // This would be similar to your existing server-side logic
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/embeddings/collections" className="text-blue-600 hover:underline">
          ← Back to Collections
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">{name} Collection</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>
        <DocumentsView documents={documents} />

        {documents.length > 0 && (
          <EmbeddingComparisonView documents={documents} documentVectors={collectionVectors} />
        )}

        {documents.length > 0 && (
          <EmbeddingVisualizer documents={documents} documentVectors={collectionVectors} />
        )}

        <EmbeddingsMetadataView documents={documents} />

      </div>
    </div>
  );
}