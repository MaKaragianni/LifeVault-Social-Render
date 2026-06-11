import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Post from "../../src/components/Post";

describe("Post", () => {
  test("displays the message as an article", () => {
    const testPost = { _id: "123", message: "test message" };
    
    render(
      <BrowserRouter>
        <Post post={testPost} />
      </BrowserRouter>
    );

    const article = screen.getByRole("article");
    
    expect(article.textContent).toContain("test message");
  });
});