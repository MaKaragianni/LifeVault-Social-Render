import { render, screen, fireEvent } from "@testing-library/react";
import { vi, beforeAll, beforeEach, describe, test, expect } from "vitest";
import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getUser } from "../../src/services/users";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
let mockParamsId = "60c72b2f9b1d8b2bad6e1a2c";

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

describe("Profile Page UI Operations", () => {
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

  test("allows interactive transition into edit state for the profile owner", async () => {
    localStorage.setItem("userId", "my_own_id");
    mockParamsId = undefined;

    getUser.mockResolvedValueOnce({
      user: { _id: "my_own_id", username: "Ariel", bio: "Best redhead ever!", profilePic: "" },
      posts: []
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const editBtn = await screen.findByText(/Edit Profile/i);
    expect(editBtn).toBeTruthy();

    fireEvent.click(editBtn);
    const saveBtn = screen.getByText(/Save/i);
    expect(saveBtn).toBeTruthy();
  });

  test("renders Add Friend with legible symbol for external profile records", async () => {
    localStorage.setItem("userId", "my_own_id");
    mockParamsId = "pinocchio_id";

    getUser.mockResolvedValueOnce({
      user: { _id: "pinocchio_id", username: "Pinocchio", bio: "Real boy!", profilePic: "" },
      posts: []
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const addFriendBtn = await screen.findByText(/Add Friend/i);
    expect(addFriendBtn).toBeTruthy();
    expect(screen.getByText("＋")).toBeTruthy();
  });
});