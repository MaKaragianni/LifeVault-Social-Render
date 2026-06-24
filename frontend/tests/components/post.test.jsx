import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
          message: "my own comment",
          likes: [],
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
          message: "not my comment",
          likes: [],
        },
      ],
    };
    renderPost(testPost);
    expect(screen.queryByText("Edit")).toBeNull();
  });

  test("allows editing a comment and saving the new text", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          comment: {
            _id: "c3",
            message: "updated text",
          },
        }),
    })
  );

  const testPost = {
    _id: "p6",
    message: "post",
    user: { _id: "other-user", username: "OtherUser" },
    comments: [
      {
        _id: "c3",
        user: { _id: "user-123", username: "TestUser" },
        message: "original text",
        likes: [],
      },
    ],
  };

  renderPost(testPost);

  fireEvent.click(screen.getByText("Edit"));

  const input = screen.getByDisplayValue("original text");

  fireEvent.change(input, {
    target: { value: "updated text" },
  });

  fireEvent.click(screen.getByText("Save"));

  await waitFor(() => {
    expect(screen.getByText("updated text")).toBeTruthy();
  });

  expect(global.fetch).toHaveBeenCalled();
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

  test("shows like button on a comment with 0 likes", () => {
    const testPost = {
      _id: "p9",
      message: "post",
      comments: [
        {
          _id: "c4",
          user: { _id: "other-user", username: "SomeUser" },
          message: "a comment",
          likes: [],
        },
      ],
    };
    renderPost(testPost);
    expect(screen.getByText("👍 Like (0)")).toBeTruthy();
  });

  test("shows Liked state when current user has liked a comment", () => {
    const testPost = {
      _id: "p10",
      message: "post",
      comments: [
        {
          _id: "c5",
          user: { _id: "other-user", username: "SomeUser" },
          message: "liked comment",
          likes: ["user-123"], // current user already liked it
        },
      ],
    };
    renderPost(testPost);
    expect(screen.getByText("👍 Liked (1)")).toBeTruthy();
  });

  test("shows correct like count when multiple users liked a comment", () => {
    const testPost = {
      _id: "p11",
      message: "post",
      comments: [
        {
          _id: "c6",
          user: { _id: "other-user", username: "SomeUser" },
          message: "popular comment",
          likes: ["other-user", "third-party", "fourth-user"],
        },
      ],
    };
    renderPost(testPost);
    expect(screen.getByText("👍 Like (3)")).toBeTruthy();
  });
});