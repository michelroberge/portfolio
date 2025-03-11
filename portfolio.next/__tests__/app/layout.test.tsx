import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("Layout Component", () => {
  it("renders the layout with header and footer", async () => {
    render(<RootLayout><div>Test Content</div></RootLayout>);
    
    await waitFor(()=>expect(screen.getByText("Curious Coder: A Portfolio")).toBeInTheDocument());
  });
});
