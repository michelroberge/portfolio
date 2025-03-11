import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CareerTimeline from "@/components/CareerTimeline";
import { fetchCareerTimeline } from "@/services/careerService";
import { marked } from "marked";

jest.mock("@/services/careerService", () => ({
    fetchCareerTimeline: jest.fn().mockResolvedValue([
      { _id: "1", title: "Software Engineer", company: "Tech Corp", description: "Worked on frontend." }
    ]),
  }));
  
jest.mock("marked", () => ({
  parse: jest.fn((input) => `<p>${input}</p>`), // Mock Markdown parsing
}));

describe("CareerTimeline Component", () => {
  const mockEntries = [
    {
      _id: "1",
      title: "Software Engineer",
      company: "Tech Corp",
      startDate: "2020-01-01",
      endDate: "2023-12-31",
      location: "Remote",
      description: "Worked on frontend development.",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchCareerTimeline as jest.Mock).mockResolvedValue(mockEntries);
  });

  it("renders career entries after fetching data", async () => {
    render(<CareerTimeline />);
    
    await waitFor(() => expect(fetchCareerTimeline).toHaveBeenCalledTimes(1));
    
    await waitFor(() => expect(screen.getByText("Software Engineer")).toBeInTheDocument());
    expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    expect(screen.getByText("Jan 2020 - Dec 2023")).toBeInTheDocument();
  });

  it("expands and collapses details on click", async () => {
    render(<CareerTimeline />);
    await waitFor(() => expect(screen.getByText("Software Engineer")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Software Engineer"));
    
    await waitFor(() => {
      expect(screen.getByText("Worked on frontend development.")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close"));
    
    await waitFor(() => {
      expect(screen.queryByText("Worked on frontend development.")).not.toBeInTheDocument();
    });
  });

  it("renders parsed markdown description correctly", async () => {
    render(<CareerTimeline />);
    await waitFor(() => expect(screen.getByText("Software Engineer")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Software Engineer"));

    await waitFor(() => {
      expect(marked.parse).toHaveBeenCalledWith("Worked on frontend development.");
      expect(screen.getByText("Worked on frontend development.")).toBeInTheDocument();
    });
  });
});
