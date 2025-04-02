import React from "react";
import { render, screen } from "@testing-library/react";
import PrivacyPolicy from "@/app/privacy-policy/page";

describe("Privacy Policy Page", () => {
  it("renders privacy policy content", () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });
});
