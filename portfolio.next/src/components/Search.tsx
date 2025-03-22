'use client';
import { useSearch } from "@/context/SearchContext";

export default function Search() {
    const { query, setQuery, results, handleSearch } = useSearch();

  return (
    <div className="relative w-full max-w-lg mx-auto mt-6">
      <input
        type="text"
        className="w-full p-3 border rounded"
        placeholder="Search projects, blogs, or skills..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        className="absolute right-2 top-2 px-4 py-1 bg-gray-800 hover:bg-gray-600 transition text-white rounded"
        onClick={handleSearch}
      >
        Search
      </button>
      {results.length > 0 && (
        <div className="mt-4 p-4 border rounded bg-white shadow-md">
          <h3 className="text-lg font-semibold">Results:</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index} className="mt-2">
                <a href={result.link} className="text-blue-500 hover:underline">
                  {result.title} ({result.type})
                </a>
                <p className="text-gray-600 text-sm">{result.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}