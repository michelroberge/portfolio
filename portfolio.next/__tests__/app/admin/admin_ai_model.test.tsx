import React from "react";
import { render, screen } from "@testing-library/react";
import AIModelSettingsPage from "@/app/admin/settings/ai-model/page";
import { AuthProvider } from "@/context/AuthContext";

describe("Admin AI Model Settings Page", () => {
  it("renders AI model settings page", () => {
    render(<AuthProvider>
            <AIModelSettingsPage />
            </AuthProvider>);
    expect(screen.getByText("AI Model Settings")).toBeInTheDocument();
  });
});
