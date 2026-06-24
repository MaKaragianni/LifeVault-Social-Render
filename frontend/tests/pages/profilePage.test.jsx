import { render, screen } from "@testing-library/react";
import { vi, beforeAll, beforeEach, afterEach, describe, test, expect } from "vitest";
import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    // No id param — so the page falls back to localStorage userId,
    // making isOwnProfile true and showing the friend request buttons.
    useParams: () => ({ id: undefined }),
  };
});

describe("Profile Page Lifecycle operations", () => {
  const PINOCCHIO_ID = "pinocchio_id";

  beforeAll(() => {
    // Provide a consistent localStorage for all tests in this suite
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        store: {},
        getItem(key) { return this.store[key] ?? null; },
        setItem(key, value) { this.store[key] = String(value); },
        removeItem(key) { delete this.store[key]; },
        clear() { this.store = {}; },
      },
      writable: true,
    });
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders active configurations and handles functional request buttons", async () => {
    localStorage.setItem("userId", PINOCCHIO_ID);
    localStorage.setItem("token", "fake-token");

    // The friend request object must have _id so the map key and handleAcceptFriend
    // call work correctly.  The user's friendRequests array is what ProfilePage reads
    // via activeUser.friendRequests after the fetch resolves.
    const mockFriendRequest = {
      _id: "ariel_id",
      username: "Ariel",
      profilePic: "",
    };

    // ProfilePage calls fetch directly — mock it at the global level so the
    // component receives the correct data without needing a real server.
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          _id: PINOCCHIO_ID,
          username: "Pinocchio",
          bio: "Wooden Boy",
          profilePic: "",
          friends: [],
          friendRequests: [mockFriendRequest],
        },
        posts: [],
      }),
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const confirmBtn = await screen.findByText(/Confirm/i);
    const deleteBtn = screen.getByText(/Delete/i);
    expect(confirmBtn).toBeTruthy();
    expect(deleteBtn).toBeTruthy();
  });
});