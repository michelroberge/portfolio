import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EntryOverview from "@/components/EntryOverview";

describe("EntryOverview Component", () => {
  const mockOnClick = jest.fn();

  const defaultProps = {
    title: "Software Engineer",
    company: "Tech Corp",
    startDate: "Jan 2020",
    endDate: "Dec 2023",
    location: "Remote",
    onClick: mockOnClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all entry details correctly", () => {
    render(<EntryOverview {...defaultProps} />);

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("Jan 2020 - Dec 2023")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    render(<EntryOverview {...defaultProps} />);

    fireEvent.click(screen.getByText("Software Engineer"));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct styling classes", () => {
    render(<EntryOverview {...defaultProps} />);

    const entryElement = screen.getByText("Software Engineer").closest("div");

    expect(entryElement).toHaveClass("border p-4 rounded-lg shadow-md bg-white cursor-pointer hover:bg-gray-100 transition");
  });
});
