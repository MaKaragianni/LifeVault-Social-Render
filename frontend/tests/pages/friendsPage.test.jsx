import { render, screen } from "@testing-library/react";
import { vi, beforeAll, beforeEach, describe, test, expect } from "vitest";
import FriendsPage from "../../src/pages/Friends/FriendsPage";
import { MemoryRouter } from "react-router-dom";

// Mocking the friends service so it doesn't try to hit a live network API during the test
vi.mock("../../src/services/friends", () => {
  return {
    getFriends: vi.fn().mockResolvedValue([]),
  };
});

describe("FriendsPage", () => {
  let localStorageMock = {};

  beforeAll(() => {
    // Injecting a robust mock for localStorage into the global test environment
    global.localStorage = {
      getItem: (key) => localStorageMock[key] || null,
      setItem: (key, value) => { localStorageMock[key] = String(value); },
      removeItem: (key) => { delete localStorageMock[key]; },
      clear: () => { localStorageMock = {}; }
    };
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("renders heading", () => {
    localStorage.setItem("token", "fake_test_token");

    render(
      <MemoryRouter>
        <FriendsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /^friends$/i })).toBeTruthy();
  });
});