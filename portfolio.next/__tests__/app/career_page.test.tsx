import React from "react";
import { render, screen } from "@testing-library/react";
import CareerPage from "@/app/career/page";

describe("Career Page", () => {
  it("renders career timeline", () => {
    render(<CareerPage />);
    expect(screen.getByText("Career Timeline")).toBeInTheDocument();
  });
});
