import { render, screen } from "@testing-library/react";
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
  return { 
    getUser: vi.fn() 
  };
});

vi.mock("../../src/services/friends", () => {
  return {
    getAllFriends: vi.fn().mockResolvedValue([]),
  };
});

describe("Profile Page UI Component", () => {
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
    mockParamsId = "60c72b2f9b1d8b2bad6e1a2c";
  });

  test("renders retrieved profile user details when token is active", async () => {
    localStorage.setItem("userId", "60c72b2f9b1d8b2bad6e1a2c");
    
    const stubUserData = {
      user: {
        _id: "60c72b2f9b1d8b2bad6e1a2c",
        email: "doe@example.com",
        username: "john_doe",
        bio: "Software developer from London",
        profilePic: "http://localhost:3000/uploads/avatar.png",
      },
      posts: []
    };

    getUser.mockResolvedValueOnce(stubUserData);

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const asyncBioElement = await screen.findByText(/Software developer from London/i);
    
    expect(asyncBioElement).toBeTruthy();
    expect(screen.getByText(/john_doe/i)).toBeTruthy();
  });

  test("redirects unauthenticated users to the login route if token is missing", () => {
    mockParamsId = undefined; 
    localStorage.removeItem("userId");

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("renders profile page", async () => {
    // Satisfy the useEffect call on mount so .then() doesn't read undefined
    getUser.mockResolvedValueOnce({
      user: {
        _id: "60c72b2f9b1d8b2bad6e1a2c",
        username: "test_user",
        bio: "",
        profilePic: "",
      },
      posts: []
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
  });
});