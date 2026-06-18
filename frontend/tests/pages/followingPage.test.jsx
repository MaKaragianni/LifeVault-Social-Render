import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { FollowingPage } from "../../src/pages/Following/FollowingPage";
import { getAllFriends } from "../../src/services/following";
import { useNavigate } from "react-router-dom";

if (typeof window !== "undefined" && !window.localStorage) {
  const mockStorage = {};
  window.localStorage = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => {
      mockStorage[key] = String(val);
    },
    removeItem: (key) => {
      delete mockStorage[key];
    },
    clear: () => {
      for (let key in mockStorage) delete mockStorage[key];
    },
  };
}

vi.mock("../../src/services/following", () => {
  const getFriendsMock = vi.fn();
  return { getAllFriends: getFriendsMock };
});

vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock };
});

describe("Following Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });

  test("It displays all users that the logged in user is following", async () => {
    window.localStorage.setItem("token", "testToken");

    const mockFreinds = [
      {
        _id: "60c72b2f9b1d8b2bad6e1a2c",
        email: "doe@example.com",
        username: "john_doe",
        bio: "Software developer from London",
        profilePic: "http://localhost:3000/uploads/avatar.png",
        friends: [],
      },
    ];
    getAllFriends.mockResolvedValue({
      friends: mockFreinds,
      token: "newToken",
    });

    render(<FollowingPage />);

    const friend = await screen.findByRole("article");
    expect(friend.textContent).toBe("john_doe");
  });

  test("It navigates to login if no token is present", async () => {
    render(<FollowingPage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
