import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectView from "@/components/project/ProjectView";
import { marked } from "marked";

jest.mock("marked", () => ({
  parse: jest.fn((input) => `<p>${input}</p>`), // ✅ Ensure parse function exists
}));

describe("ProjectView Component", () => {
  const mockProject = {
    _id: 0,
    link: "",
    title: "Test Project",
    description: "This is a test project description.",
  };

  it("renders project title correctly", () => {
    render(<ProjectView project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders parsed markdown description correctly", () => {
    render(<ProjectView project={mockProject} />);
    expect(marked.parse).toHaveBeenCalledWith("This is a test project description.");
  });
});
