import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { login } from "../../src/services/authentication";
import { LoginPage } from "../../src/pages/Login/LoginPage";

// Fallback storage object in case the environment lacks it
if (typeof window !== "undefined" && !window.localStorage) {
  const mockStorage = {};
  window.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { for (let key in mockStorage) delete mockStorage[key]; }
  };
}

// Mocking the authentication service using a self-contained vi.fn()
vi.mock("../../src/services/authentication", () => {
  return { login: vi.fn() };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock };
});

// Reusable function for filling out login form
async function completeLoginForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Hello14!");
  await user.click(submitButtonEl);
}

describe("Login Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.localStorage.clear();
  });

  test("allows a user to login", async () => {
    login.mockResolvedValue({ token: "secrettoken123", userId: "user123" });
    render(<LoginPage />);

    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("test@email.com", "Hello14!");
  });

  test("navigates to /posts on successful login", async () => {
    render(<LoginPage />);

    login.mockResolvedValue({ token: "secrettoken123", userId: "user123" });
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/posts");
  });

  test("navigates to /login on unsuccessful login", async () => {
    render(<LoginPage />);

    login.mockRejectedValue(new Error("Error logging in"));
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});