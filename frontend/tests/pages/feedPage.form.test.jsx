// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getPosts } from "../../src/services/posts";
import { useNavigate } from "react-router-dom";

// Mocking the getPosts service
vi.mock("../../src/services/posts", () => {
  return { getPosts: vi.fn() };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  return { useNavigate: vi.fn(() => vi.fn()) };
});

describe("Feed Page - Post Form", () => {
    // Mocking localStorage manually before running tests
    beforeEach(() => {
    let store = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; }
      },
      writable: true
    });
    
    // Clear it to keep tests isolated
    window.localStorage.clear();
  });

  test("renders post input and button", async () => {
    window.localStorage.setItem("token", "testToken");

    vi.mocked(getPosts).mockResolvedValue({
        posts: [],
        token: "newToken",
    });

    render(<FeedPage />);

    const textarea = await screen.findByPlaceholderText("What's on your mind?");
    const button = await screen.findByRole("button", { name: "Post" });

    expect(textarea).toBeTruthy();
    expect(button).toBeTruthy();
  });
});