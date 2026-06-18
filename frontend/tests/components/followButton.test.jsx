import {
  render,
  screen,
  fireEvent,
  waitFor,
  getByRole,
} from "@testing-library/react";
import FollowButton from "../../src/components/FollowButton";
import * as followingService from "../../src/services/following";
import { beforeEach, expect, vi } from "vitest";

vi.mock("../../src/services/following", () => ({
  handleFollow: vi.fn(),
  getAllFriends: vi.fn(),
  searchUsers: vi.fn(),
}));

const localStorageMock = (() => {
  let store = {};

  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("followButton", () => {
  beforeEach(() => {
    localStorage.setItem("userId", "user1");
    localStorage.setItem("token", "fake-token");
    followingService.getAllFriends.mockResolvedValue({ friends: [] });

    vi.clearAllMocks();
  });

  test("show '+ Follow' when new user clicks on a 'friend' profile", () => {
    render(<FollowButton />);

    expect(screen.getByRole("button").textContent).toContain("+ Follow");
  });

  test("show '- Unfollow' when user clicks on follow button and '+follow' when clicking again", async () => {
    render(<FollowButton />);

    expect(screen.getByRole("button").textContent).toContain("+ Follow");

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toContain("- Unfollow");
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toContain("+ Follow");
    });
  });
});
