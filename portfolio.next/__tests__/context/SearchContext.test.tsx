import React from "react";
import { renderHook, act } from "@testing-library/react";
import { SearchProvider, useSearch } from "@/context/SearchContext";

describe("SearchContext", () => {
  it("provides default search state", () => {
    const { result } = renderHook(() => useSearch(), { wrapper: SearchProvider });

    expect(result.current.query).toBe("");
    expect(result.current.results).toEqual([]);
  });

  it("updates search results", async () => {
    const { result } = renderHook(() => useSearch(), { wrapper: SearchProvider });

    await act(async () => {
      result.current.setQuery("test");
    });

    expect(result.current.query).toBe("test");
  });
});
