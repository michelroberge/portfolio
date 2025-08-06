'use client';
import { useEffect, useState, useCallback } from "react";
import { useSearch } from "@/context/SearchContext";
import { useLoading } from '@/context/LoadingContext';

export default function Search() {
    const { query, setQuery, results, handleSearch } = useSearch();
    const { showLoading, hideLoading } = useLoading();
    const [showNoResults, setShowNoResults] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const doSearch = async () => {
      showLoading();
      try{
        await handleSearch();
      }
      finally{
        hideLoading();
      }
    }

    // Debounced function to show no results message
    const debouncedShowNoResults = useCallback(() => {
      const timer = setTimeout(() => {
        if (query.trim() && results.length === 0) {
          setShowNoResults(true);
          // Trigger grow in effect
          setTimeout(() => setIsVisible(true), 10);
          // Auto-hide after 3 seconds
          setTimeout(() => {
            setIsVisible(false);
            // Wait for grow out animation to complete before hiding
            setTimeout(() => setShowNoResults(false), 300);
          }, 3000);
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(timer);
    }, [query, results]);

    useEffect(() => {
      const loadData = async () => {
        try {
          await doSearch();
        } finally {
          hideLoading();
        }
      };
  
      loadData();
    }, [showLoading, hideLoading]);

    // Effect to handle showing no results message with debouncing
    useEffect(() => {
      if (query.trim() && results.length === 0) {
        const cleanup = debouncedShowNoResults();
        return cleanup;
      } else {
        setIsVisible(false);
        setTimeout(() => setShowNoResults(false), 300);
      }
    }, [query, results, debouncedShowNoResults]);
    
  return (
    <div className="relative w-full max-w-lg mx-auto mt-6">
      <input
        type="text"
        className="w-full p-3 border rounded text-gray-800"
        placeholder="Search projects, blogs, or skills..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && doSearch()}
      />
      <button
        className="absolute right-2 top-2 px-4 py-1 bg-gray-800 hover:bg-gray-600 transition text-white rounded"
        onClick={doSearch}
      >
        Search
      </button>
      {results.length > 0 ? (
        <div className="mt-4 p-4 border rounded bg-white shadow-md">
          <h3 className="text-lg font-semibold">Results:</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index} className="mt-2">
                <a href={result.link} className="text-blue-500 hover:underline">
                  {result.title} ({result.type})
                </a>
                <p className="text-gray-600 text-sm">{result.excerpt}</p>
                <b>{result.score}</b>
              </li>
            ))}
          </ul>
        </div>
      ) : showNoResults && (
        <div 
          className={`mt-4 p-4 border rounded bg-yellow-50 shadow-md transition-all duration-300 ease-in-out transform ${
            isVisible 
              ? 'scale-100 opacity-100' 
              : 'scale-95 opacity-0'
          }`}
        >
          <p className="text-yellow-800 font-medium">Nothing found, something's fishy with the search still...</p>
        </div>
      )}
    </div>
  );
}