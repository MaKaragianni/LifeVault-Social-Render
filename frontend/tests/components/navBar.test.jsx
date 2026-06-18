import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "../../src/components/Navbar";

describe("Navbar Component", () => {
    it("renders the logo with correct alt text", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        const logo = screen.getByAltText("logo");
        expect(logo).toBeInTheDocument();
    });

    it("contains links to Feed, Profile and Following pages", () => {
            render(
                <MemoryRouter>
                    <Navbar />
                </MemoryRouter>
            );

            //Verifying the links exist and display correctly
            const feedLink = screen.getByRole("link", { name: /feed/i });
            const profileLink = screen.getByRole("link", { name: /profile/i });
            const followingLink = screen.getByRole("link", { name: /following/i });

            expect(feedLink).toBeInTheDocument();
            expect(profileLink).toBeInTheDocument();
            expect(followingLink).toBeInTheDocument();

            //Verifying the links navigate to the right URLs
            expect(feedLink).toHaveAttribute("href", "/posts");
            expect(profileLink).toHaveAttribute("href", "/profile");
            expect(followingLink).toHaveAttribute("href", "/following");   
    });
});