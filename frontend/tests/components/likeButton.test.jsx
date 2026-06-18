import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LikeButton from "../../src/components/likeButton";
import * as postsService from "../../src/services/posts";
import { vi } from "vitest";


vi.mock("../../src/services/posts", () => ({
    likePost: vi.fn(),
    getPosts: vi.fn(),
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

describe("LikeButton", () => {
    beforeEach(() => {
        localStorage.setItem("userId", "user1");
        localStorage.setItem("token", "fake-token");

        vi.clearAllMocks();
    });

    test("show green heart when post is liked", () => {
        const post = {
            _id: "123",
            likes: ["user1"],
        };

        render(<LikeButton post={post} onUpdate={vi.fn()} />);

        expect(screen.getByRole("button").textContent).toContain("💚");
    });

    test("show unclicked heart when post is not liked", () => {
        const post = {
            _id: "123",
            likes: [],
        };

        render(<LikeButton post={post} onUpdate={vi.fn()} />);

        expect(screen.getByRole("button").textContent).toContain("♡");
    });

    test("calls API and triggers onUpdate when clicked", async () => {
        const post = {
            _id: "123",
            likes: [],
        };

        const mockUpdate = vi.fn();

        postsService.likePost.mockResolvedValue({
            likes: ["user1"],
        });

        render(<LikeButton post={post} onUpdate={mockUpdate} />);

        const button = screen.getByRole("button");

        fireEvent.click(button);

        await waitFor(() => {
            expect(postsService.likePost).toHaveBeenCalledWith(
                "fake-token",
                "123"
            );
            expect(mockUpdate).toHaveBeenCalledWith(["user1"]);
        });
    })
})