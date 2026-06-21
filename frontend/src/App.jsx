import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { FollowingPage } from "./pages/Following/FollowingPage";
import { FriendRequestsPage } from "./pages/FriendRequests/FriendRequestsPage";
import ForgotPasswordPage from "./pages/Password/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Password/ResetPasswordPage";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/posts", element: <FeedPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/:id", element: <ProfilePage /> },
  { path: "/following", element: <FollowingPage /> },
  { path: "/friend-requests", element: <FriendRequestsPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PROFILE (USERNAME ROUTE) */}
        <Route
          path="/profile/:username"
          element={<ProfilePage />}
        />

        {/* FRIEND REQUESTS */}
        <Route
          path="/friend-requests"
          element={<FriendRequestsPage />}
        />

        {/* PASSWORD RESET FLOW */}
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;