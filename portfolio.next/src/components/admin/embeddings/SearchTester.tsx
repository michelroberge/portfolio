"use client"

import React, { useState } from 'react';
import { Collection } from '@/models/Embeddings/Collection';
import { SearchResult } from '@/models/Embeddings/SearchResult';
import embeddingService from '@/services/embeddingService';

interface SearchTesterProps {
  collections: Collection[];
  cookieHeader: string;
}

const SearchTester: React.FC<SearchTesterProps> = ({ collections, cookieHeader }) => {
  const [query, setQuery] = useState<string>('');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCollectionToggle = (collection: string) => {
    if (selectedCollections.includes(collection)) {
      setSelectedCollections(selectedCollections.filter(c => c !== collection));
    } else {
      setSelectedCollections([...selectedCollections, collection]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsLoading(true);
    try {
      const searchResults = await embeddingService.handleSearch(query, selectedCollections, cookieHeader);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="p-6 border rounded-lg bg-white">
        <h2 className="text-xl font-semibold mb-4">Test Semantic Search</h2>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Search Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your search query"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Collections to Search
          </label>
          <div className="space-y-2">
            {collections?.map((collection) => (
              <div key={collection.name} className="flex items-center">
                <input
                  type="checkbox"
                  id={`collection-${collection.name}`}
                  checked={selectedCollections.includes(collection.name)}
                  onChange={() => handleCollectionToggle(collection.name)}
                  className="mr-2"
                />
                <label htmlFor={`collection-${collection.name}`}>
                  {collection.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!query || selectedCollections.length === 0 || isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {results.length > 0 && (
        <div className="p-6 border rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="p-4 border rounded">
                <div className="flex justify-between">
                  <h3 className="font-medium">{result.document.title}</h3>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    Score: {result.score.toFixed(4)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Collection: {result.document.collection}
                </p>
                <p className="text-sm text-gray-600">
                  Embedding: {result.document.embedding.model} v{result.document.embedding.version}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTester;
