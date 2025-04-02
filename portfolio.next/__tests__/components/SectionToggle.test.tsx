import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SectionToggle from "@/components/SectionToggle";

describe("SectionToggle Component", () => {
  const mockSetActiveSection = jest.fn();

  it("renders blog and project buttons", () => {
    render(<SectionToggle activeSection="blogs" setActiveSection={mockSetActiveSection} />);
    expect(screen.getByText("Blogs")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("calls setActiveSection when switching sections", () => {
    render(<SectionToggle activeSection="blogs" setActiveSection={mockSetActiveSection} />);
    fireEvent.click(screen.getByText("Projects"));
    expect(mockSetActiveSection).toHaveBeenCalledWith("projects");
  });
});
