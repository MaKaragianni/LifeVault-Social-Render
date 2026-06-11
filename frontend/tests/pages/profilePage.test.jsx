import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getUser } from "../../src/services/users";

// Creating top-level control variables for mocks
const mockNavigate = vi.fn();
let mockParamsId = "60c72b2f9b1d8b2bad6e1a2c";

// Mocking React Router dependencies
vi.mock("react-router-dom", () => {
  return {
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: mockParamsId }),
  };
});

// Mocking the getUser service
vi.mock("../../src/services/users", () => {
  return { 
    getUser: vi.fn() 
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
    // Reset our mock param back to default before every test
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

    render(<ProfilePage />);

    // Using regex matchers so text split across prefixes
    const asyncBioElement = await screen.findByText(/Software developer from London/i);
    
    expect(asyncBioElement).toBeTruthy();
    expect(screen.getByText(/john_doe/i)).toBeTruthy();
  });

  test("redirects unauthenticated users to the login route if token is missing", () => {
    mockParamsId = undefined; 
    localStorage.removeItem("userId");

    render(<ProfilePage />);
    
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});