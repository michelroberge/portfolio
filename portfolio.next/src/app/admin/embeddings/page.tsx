import React from 'react';
import { protectAdminRoute, getAdminCookie } from "@/lib/auth";
import CollectionList from '@/components/admin/embeddings/CollectionList';
import RegenerateEmbeddingForm from '@/components/admin/embeddings/RegenerateEmbeddingForm';
import SearchTester from '@/components/admin/embeddings/SearchTester';
import embeddingService from '@/services/embeddingService';

export default async function EmbeddingsManagement() {
  const { user } = await protectAdminRoute();
  const { cookieHeader } = await getAdminCookie(user);
  const collections = await embeddingService.fetchCollections(cookieHeader)

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold mb-6">Manage AI Embeddings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Collections</h2>
            <CollectionList
              collections={collections}
              isLoading={false}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Test Search</h2>
            <SearchTester collections={collections} cookieHeader={cookieHeader} />
          </div>
        </div>

        <div>
          <RegenerateEmbeddingForm collections={collections} cookieHeader={cookieHeader} />
        </div>
      </div>
    </div>
  );
}
