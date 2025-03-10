import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Search from "@/components/Search";
import { useSearch } from "@/context/SearchContext";

jest.mock("@/context/SearchContext", () => ({
  useSearch: jest.fn(),
}));

describe("Search Component", () => {
  const mockSetQuery = jest.fn();
  const mockHandleSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearch as jest.Mock).mockReturnValue({
      query: "",
      setQuery: mockSetQuery,
      results: [],
      handleSearch: mockHandleSearch,
    });
  });

  it("renders search input", () => {
    render(<Search />);
    expect(screen.getByPlaceholderText("Search projects, blogs, or skills...")).toBeInTheDocument();
  });

  it("calls handleSearch when clicking search button", () => {
    render(<Search />);
    fireEvent.click(screen.getByText("Search"));
    expect(mockHandleSearch).toHaveBeenCalled();
  });
});
