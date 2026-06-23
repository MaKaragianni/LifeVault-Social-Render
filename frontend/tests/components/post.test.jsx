import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeAll } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Post from "../../src/components/Post";

// Mock localStorage so currentUserId is predictable
beforeAll(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (key) => {
        if (key === "userId") return "user-123";
        if (key === "username") return "TestUser";
        return null;
      },
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });
});

const renderPost = (post) =>
  render(
    <BrowserRouter>
      <Post post={post} />
    </BrowserRouter>
  );

describe("Post component", () => {
  test("displays the message as an article", () => {
    const testPost = { _id: "p1", message: "test message" };
    renderPost(testPost);
    const article = screen.getByRole("article");
    expect(article.textContent).toContain("test message");
  });

  test("shows Edit Post button when post belongs to the current user", () => {
    const testPost = {
      _id: "p2",
      message: "my post",
      user: { _id: "user-123", username: "TestUser" },
    };
    renderPost(testPost);
    expect(screen.getByText("Edit Post")).toBeTruthy();
  });

  test("does NOT show Edit Post button when post belongs to another user", () => {
    const testPost = {
      _id: "p3",
      message: "someone else's post",
      user: { _id: "other-user", username: "OtherUser" },
    };
    renderPost(testPost);
    expect(screen.queryByText("Edit Post")).toBeNull();
  });

  // Edit comment button only appears for the comment owner
  test("shows Edit button on a comment owned by the current user", () => {
    const testPost = {
      _id: "p4",
      message: "post with comments",
      user: { _id: "other-user", username: "OtherUser" },
      comments: [
        {
          _id: "c1",
          user: { _id: "user-123", username: "TestUser" }, // matches localStorage userId
          text: "my own comment",
          likes: 0,
          hasLikedComment: false,
        },
      ],
    };
    renderPost(testPost);
    expect(screen.getByText("Edit")).toBeTruthy();
  });

  test("does NOT show Edit button on a comment owned by someone else", () => {
    const testPost = {
      _id: "p5",
      message: "post",
      user: { _id: "other-user", username: "OtherUser" },
      comments: [
        {
          _id: "c2",
          user: { _id: "third-party", username: "SomeoneElse" },
          text: "not my comment",
          likes: 0,
          hasLikedComment: false,
        },
      ],
    };
    renderPost(testPost);
    expect(screen.queryByText("Edit")).toBeNull();
  });

  test("allows editing a comment and saving the new text", () => {
    const testPost = {
      _id: "p6",
      message: "post",
      user: { _id: "other-user", username: "OtherUser" },
      comments: [
        {
          _id: "c3",
          user: { _id: "user-123", username: "TestUser" },
          text: "original text",
          likes: 0,
          hasLikedComment: false,
        },
      ],
    };
    renderPost(testPost);

    fireEvent.click(screen.getByText("Edit"));
    const input = screen.getByDisplayValue("original text");
    fireEvent.change(input, { target: { value: "updated text" } });
    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("updated text")).toBeTruthy();
  });

  test("renders post image when provided", () => {
    const testPost = {
      _id: "p7",
      message: "post with image",
      image: "https://example.com/img.jpg",
    };
    renderPost(testPost);
    const img = screen.getByAltText("Attached content");
    expect(img.src).toBe("https://example.com/img.jpg");
  });

  test("renders the comment input form", () => {
    renderPost({ _id: "p8", message: "hello" });
    expect(screen.getByPlaceholderText("Add a comment...")).toBeTruthy();
    expect(screen.getByText("Send")).toBeTruthy();
  });
});