import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer Component", () => {
  it("renders the footer text correctly", () => {
    render(<Footer />);
    expect(screen.getByText(/michel-roberge.com/i)).toBeInTheDocument();
    expect(screen.getByText(/All Rights Reserved/i)).toBeInTheDocument();
  });

  it("displays the current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString(), "i"))).toBeInTheDocument();
  });
});
