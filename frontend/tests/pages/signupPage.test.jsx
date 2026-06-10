import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { signup } from "../../src/services/authentication";

import { SignupPage } from "../../src/pages/Signup/SignupPage";

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Mocking the signup service
vi.mock("../../src/services/authentication", () => {
  const signupMock = vi.fn();
  return { signup: signupMock };
});

// Reusable function for filling out signup form
async function completeSignupForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Hello14!");
  await user.type(confirmPasswordInputEl, "Hello14!");
  await user.click(submitButtonEl);
}

describe("Signup Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to signup", async () => {
    render(<SignupPage />);

    await completeSignupForm();

    expect(signup).toHaveBeenCalledWith("test@email.com", "Hello14!");
  });

  test("navigates to /login on successful signup with passwords matching", async () => {
    render(<SignupPage />);

    const navigateMock = useNavigate();

    await completeSignupForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("navigates to /signup on unsuccessful signup", async () => {
    render(<SignupPage />);

    signup.mockRejectedValue(new Error("Error signing up"));
    const navigateMock = useNavigate();

    await completeSignupForm();

    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});

test("When user types password with no capital letter, no special char or no number, error occurs.", async () => {
  render(<SignupPage />);

  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "hello");
  await user.type(confirmPasswordInputEl, "hello");
  await user.click(submitButtonEl);

  screen.getByText(
    "Password must contain at least 1 capital letter, a number and a special character!",
  );
});

test("When user types password with no capital letter, error occurs.", async () => {
  render(<SignupPage />);

  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "hello14!");
  await user.type(confirmPasswordInputEl, "Hello14!");
  await user.click(submitButtonEl);

  screen.getByText(
    "Password must contain at least 1 capital letter, a number and a special character!",
  );
});

test("When user types password with no special char, error occurs.", async () => {
  render(<SignupPage />);

  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Hello123");
  await user.type(confirmPasswordInputEl, "Hello123");
  await user.click(submitButtonEl);

  screen.getByText(
    "Password must contain at least 1 capital letter, a number and a special character!",
  );
});

test("When user types password with no number, error occurs.", async () => {
  render(<SignupPage />);

  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Hello!!!");
  await user.type(confirmPasswordInputEl, "Hello!!!");
  await user.click(submitButtonEl);

  screen.getByText(
    "Password must contain at least 1 capital letter, a number and a special character!",
  );
});

test("When user types a password less than 8 characters long an error occurs.", async () => {
  render(<SignupPage />);

  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Hello!1");
  await user.type(confirmPasswordInputEl, "Hello!1");
  await user.click(submitButtonEl);

  screen.getByText("Password must be between 8 and 12 characters long");
});

test("When user types a password more than 12 characters long an error occurs.", async () => {
  render(<SignupPage />);

  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Hello!1aaaaaa");
  await user.type(confirmPasswordInputEl, "Hello!1aaaaaa");
  await user.click(submitButtonEl);

  screen.getByText("Password must be between 8 and 12 characters long");
});

test("When user inputs a valid password but confirm password doesn't match, error occurs.", async () => {
  render(<SignupPage />);

  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const confirmPasswordInputEl = screen.getByLabelText("Confirm Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Hello14!");
  await user.type(confirmPasswordInputEl, "Hello14");
  await user.click(submitButtonEl);

  screen.getByText("Passwords don't match");
});
