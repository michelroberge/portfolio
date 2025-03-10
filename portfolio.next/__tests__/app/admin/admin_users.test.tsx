import React from "react";
import { render, screen } from "@testing-library/react";
import AdminUsers from "@/app/admin/users/page";
import { AuthProvider } from "@/context/AuthContext";

describe("Admin Users Page", () => {
  it("renders user management interface", () => {
    render(<AuthProvider><AdminUsers /></AuthProvider>);
    expect(screen.getByText("Manage Users")).toBeInTheDocument();
  });
});
