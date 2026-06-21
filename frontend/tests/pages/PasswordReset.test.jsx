import { render } from "@testing-library/react";
import { test } from "vitest";

import ForgotPasswordPage from "../../src/pages/Password/ForgotPasswordPage";

test("renders forgot password page", () => {
  render(<ForgotPasswordPage />);
});