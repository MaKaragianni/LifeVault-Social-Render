import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeAll, vi } from "vitest";
import Navbar from "../../src/components/Navbar";

vi.mock("../../src/components/SearchBar", () => {
  return {
    default: () => <div data-testid="mock-search-bar">Search Bar Mock</div>
  };
});

describe("Navbar Component", () => {
  beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn().mockReturnValue("60c72b2f9b1d8b2bad6e1a2c"),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  it("renders the logo with correct alt text", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logo = screen.getByAltText("logo");
    expect(logo).toBeTruthy();
  });

  it("contains links to Feed, Profile and Friends pages", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Verifying the links exist and display correctly
    const feedLink = screen.getByRole("link", { name: /feed/i });
    const profileLink = screen.getByRole("link", { name: /profile/i });
    const friendsLink = screen.getByRole("link", { name: /friends/i });

    expect(feedLink).toBeTruthy();
    expect(profileLink).toBeTruthy();
    expect(friendsLink).toBeTruthy();

    // Verifying the links navigate to the right URLs
    expect(feedLink.getAttribute("href")).toBe("/posts");
    expect(profileLink.getAttribute("href")).toBe("/profile/60c72b2f9b1d8b2bad6e1a2c");
    expect(friendsLink.getAttribute("href")).toBe("/friends");   
  });
});