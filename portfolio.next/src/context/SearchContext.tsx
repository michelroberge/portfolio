'use client';
import { createContext, useContext, useState, ReactNode } from "react";
import { PUBLIC_API } from "@/lib/constants";

interface SearchResult {
  title: string;
  description: string;
  type: "project" | "blog" | "career" | "general";
  link: string;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  handleSearch: () => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);

  async function search(userQuery: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(PUBLIC_API.search, {
        method: "POST",
        body: JSON.stringify({query: userQuery}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to search projects");
      }

      return response.json();
    } catch (error) {
      console.error("Failed to search projects:", error);
      return [];
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]); // Clear results if query is empty
      return;
    }

    try {
      const projects = await search(query);
      const searchResults: SearchResult[] = results
        .filter(result => result.link) // Only include projects with valid links
        .map((result) => ({
          title: result.title,
          description: result.description,
          type: result.type,
          link: result.link!, // Safe to use ! here as we filtered undefined links
        }));

      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    }
  };

  return (
    <SearchContext.Provider value={{ query, setQuery, results, handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
