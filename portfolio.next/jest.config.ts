import nextJest from "next/jest";
import type { Config } from "jest";

// Create Jest config using Next.js built-in transformer
const createJestConfig = nextJest({
  dir: "./", // ✅ Ensures Jest loads Next.js environment correctly
});

const customJestConfig: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["node_modules/(?!(next)/)"], // ✅ Ensures Next.js dependencies are processed correctly
};

// Export Jest config with Next.js compatibility
export default createJestConfig(customJestConfig);
