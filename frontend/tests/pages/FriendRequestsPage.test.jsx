import { render, screen } from "@testing-library/react";
import { describe, test, expect, beforeAll, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FriendRequestsPage from "../../src/pages/FriendRequests/FriendRequestsPage"; 

// Mocking the backend service to prevent real fetch requests
vi.mock("../../src/services/friendRequests", () => {
  return {
    getFriendRequests: vi.fn().mockResolvedValue({
      requests: [],
      token: "mock-token"
    })
  };
});

describe("Friend Requests Page", () => {
  beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn().mockReturnValue("mock-token-123"),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  test("renders friend requests page", () => {
    render(
      <MemoryRouter>
        <FriendRequestsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Friend Requests", level: 2 })).toBeTruthy();
  });
});