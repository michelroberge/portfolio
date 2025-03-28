import React from 'react';
import Link from 'next/link';
import { Collection } from '@/models/Embeddings/Collection';

interface CollectionListProps {
  collections: Collection[];
  isLoading: boolean;
}

const CollectionList: React.FC<CollectionListProps> = ({ collections, isLoading }) => {
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading collections...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collections?.map((collection) => (
        <Link 
          href={`/admin/embeddings/collections/${collection.name}`} 
          key={collection.name}
          className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold">{collection.name}</h2>
          <div className="mt-2 text-gray-600">
            <p>{collection.count} documents</p>
            <p>Model: {collection.embeddingModel}</p>
            <p>Last updated: {new Date(collection.lastUpdated).toLocaleDateString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CollectionList;