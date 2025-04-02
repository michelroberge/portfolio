import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/_not-found/page";

describe("NotFound Page", () => {
  it("renders the not found message", () => {
    render(<NotFound />);
    expect(screen.getByText("Ooops")).toBeInTheDocument();
  });
});
