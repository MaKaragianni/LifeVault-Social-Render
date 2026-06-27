import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { MemoryRouter } from "react-router-dom";
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

// Mocking the authentication service
vi.mock("../../src/services/authentication", () => {
  return { login: vi.fn() };
});

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
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
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("test@email.com", "Hello14!");
  });

  test("navigates to /posts on successful login", async () => {
    login.mockResolvedValue({ token: "secrettoken123", userId: "user123" });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/posts");
  });

  test("shows 'User not found' error when email does not exist", async () => {
    login.mockRejectedValue(new Error("User not found"));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await completeLoginForm();

    expect(screen.getByText("User not found")).toBeTruthy();
  });

  test("shows 'Password incorrect' error when password is wrong", async () => {
    login.mockRejectedValue(new Error("Password incorrect"));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await completeLoginForm();

    expect(screen.getByText("Password incorrect")).toBeTruthy();
  });

  test("renders a Forgot Password link pointing to /forgot-password", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const forgotLink = screen.getByRole("link", { name: /forgot password/i });
    expect(forgotLink).toBeTruthy();
    expect(forgotLink.getAttribute("href")).toBe("/forgot-password");
  });
});