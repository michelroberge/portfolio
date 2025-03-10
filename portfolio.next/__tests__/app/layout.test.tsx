import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("Layout Component", () => {
  it("renders the layout with header and footer", () => {
    render(<RootLayout><div>Test Content</div></RootLayout>);
    
    expect(screen.getByText("Curious Coder: A Portfolio")).toBeInTheDocument();
  });
});
