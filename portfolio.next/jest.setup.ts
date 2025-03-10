import "@testing-library/jest-dom";
// import React from "react";
// global.React = React;

// Global mock for fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000";
jest.spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  jest.clearAllMocks();
});
