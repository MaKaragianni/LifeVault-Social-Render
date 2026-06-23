import { render, screen, fireEvent } from "@testing-library/react";
import { vi, beforeAll, beforeEach, describe, test, expect } from "vitest";
import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getUser } from "../../src/services/users";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
let mockParamsId = undefined;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: mockParamsId }),
  };
});

vi.mock("../../src/services/users", () => {
  return { getUser: vi.fn() };
});

describe("Profile Page Lifecycle operations", () => {
  let localStorageMock = {};

  beforeAll(() => {
    window = window || {};
    localStorage = {
      getItem: (key) => localStorageMock[key] || null,
      setItem: (key, value) => { localStorageMock[key] = String(value); },
      removeItem: (key) => { delete localStorageMock[key]; },
      clear: () => { localStorageMock = {}; }
    };
    window.localStorage = localStorage;
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("renders active configurations and handles functional request buttons", async () => {
    localStorage.setItem("userId", "pinocchio_id");
    localStorage.setItem(
      "friendRequests_pinocchio_id",
      JSON.stringify([{ id: "r1", fromId: "ariel_id", fromUsername: "Ariel" }])
    );

    getUser.mockResolvedValueOnce({
      user: { _id: "pinocchio_id", username: "Pinocchio", bio: "Wooden Boy" },
      posts: []
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const acceptBtn = await screen.findByText(/Accept/i);
    const rejectBtn = screen.getByText(/Reject/i);
    expect(acceptBtn).toBeTruthy();
    expect(rejectBtn).toBeTruthy();
  });
});