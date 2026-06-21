import { render, screen } from "@testing-library/react";
import FriendRequestsPage from "../pages/FriendRequests/FriendRequestsPage";

test("renders friend requests page", () => {
  render(<FriendRequestsPage />);

  expect(
    screen.getByText("Friend Requests")
  ).toBeInTheDocument();
});