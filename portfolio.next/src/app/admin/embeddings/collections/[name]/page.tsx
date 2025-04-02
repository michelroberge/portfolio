import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import React from 'react';
import Link from 'next/link';

import embeddingService from "@/services/embeddingService";
import CollectionPageClient from "@/components/admin/embeddings/CollectionPageClient";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function CollectionPage({ params }: Props) {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);
  const { name } = await params;

  let documents = await embeddingService.fetchDocuments(name, cookieHeader, () => {});
  if (!documents) documents = [];
  const collectionVectors = await embeddingService.fetchCollectionVectors(name, cookieHeader);

  const handleRegenerateSelected = async (ids: string[]) => {
    'use server';
    // Implement your server action for regenerating embeddings
    console.log("ids", ids);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/embeddings/collections" className="text-blue-600 hover:underline">
          ← Back to Collections
        </Link>
      </div>

      <CollectionPageClient
        documents={documents}
        collectionVectors={collectionVectors}
        name={name}
        onRegenerateEmbeddings={handleRegenerateSelected}
      />
    </div>
  );
}