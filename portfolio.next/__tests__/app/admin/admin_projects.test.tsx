import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectManagement from "@/app/admin/projects/page";
import { AuthProvider } from "@/context/AuthContext";
describe("Admin Projects Page", () => {
  it("renders the projects page with title", () => {
    render(<AuthProvider><ProjectManagement /></AuthProvider>);
    expect(screen.getByText("Manage Projects")).toBeInTheDocument();
  });
});
