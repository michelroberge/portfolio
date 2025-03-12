'use client';
import { createContext, useContext, useState, ReactNode } from "react";
import { API_ENDPOINTS } from "@/lib/constants";

type SearchResult = {
  title: string;
  description: string;
  type: "project" | "blog";
  link: string;
};

type SearchContextType = {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  setResults: (results: SearchResult[]) => void;
  handleSearch: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    const response = await fetch(`${API_ENDPOINTS.search}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
  
    const results = await response.json();
    setResults(results);
  };

  return (
    <SearchContext.Provider value={{ query, setQuery, results, setResults, handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
