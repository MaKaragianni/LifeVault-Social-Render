import { render } from "@testing-library/react";
import { test, beforeAll, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import ForgotPasswordPage from "../../src/pages/Password/ForgotPasswordPage";

// Mock localStorage before the test runs
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn().mockReturnValue("mock-user-123"),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });
});

test("renders forgot password page", () => {
  render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>
  );
});