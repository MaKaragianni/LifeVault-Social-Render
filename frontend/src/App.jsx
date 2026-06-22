import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import FriendsPage from "./pages/Friends/FriendsPage";
import FriendRequestsPage from "./pages/FriendRequests/FriendRequestsPage";
import ForgotPasswordPage from "./pages/Password/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Password/ResetPasswordPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/posts", element: <FeedPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/:id", element: <ProfilePage /> },
  { path: "/profile/:username", element: <ProfilePage /> },
  { path: "/friends", element: <FriendsPage /> },
  { path: "/friend-requests", element: <FriendRequestsPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}