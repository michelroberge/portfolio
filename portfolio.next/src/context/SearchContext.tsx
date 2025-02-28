'use client';
import { createContext, useContext, useState, ReactNode } from "react";

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

    // Mock API response
    setTimeout(() => {
      setResults([
        { title: "Next.js Portfolio", description: "A modern portfolio built with Next.js", type: "project", link: "/projects/nextjs-portfolio" },
        { title: "AI Chatbot Integration", description: "Implementing AI chatbot with Ollama.", type: "blog", link: "/blogs/ai-chatbot-integration" }
      ]);
    }, 1000);
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
