"use client"
import React, { useState } from 'react';
import { Collection } from '@/models/Embeddings/Collection';
import embeddingService from '@/services/embeddingService';

interface RegenerateEmbeddingFormProps {
  collections: Collection[];
  cookieHeader: string;
}

const RegenerateEmbeddingForm: React.FC<RegenerateEmbeddingFormProps> = ({
  collections,
  cookieHeader,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('default');
  const [isLoading, setIsLoading] = useState<boolean>();

  const handleSubmit = async  (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCollection) {
        setIsLoading(true);
        await embeddingService.handleRegenerateByCollection(
        selectedCollection,
        selectedModel === 'default' ? undefined : selectedModel,
        cookieHeader
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 border rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Regenerate Embeddings by Collection</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Collection
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            required
          >
            <option value="">Select a collection</option>
            {collections.map((collection) => (
              <option key={collection.name} value={collection.name}>
                {collection.name} ({collection.count} documents)
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Embedding Model
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="default">Default Model</option>
            <option value="text-embedding-ada-002">text-embedding-ada-002</option>
            <option value="text-embedding-3-small">text-embedding-3-small</option>
            <option value="text-embedding-3-large">text-embedding-3-large</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={!selectedCollection || isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Regenerate All Embeddings in Collection'}
        </button>
      </form>
    </div>
  );
};

export default RegenerateEmbeddingForm;
