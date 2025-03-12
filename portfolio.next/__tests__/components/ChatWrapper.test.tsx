import React from "react";
import { render } from "@testing-library/react";
import ChatWrapper from "@/components/ChatWrapper";

jest.mock("next/dynamic", () => () => () => <div>Mocked Chat Component</div>);

describe("ChatWrapper Component", () => {
  it("renders Chat component", () => {
    const { getByText } = render(<ChatWrapper />);
    expect(getByText("Mocked Chat Component")).toBeInTheDocument();
  });
});
