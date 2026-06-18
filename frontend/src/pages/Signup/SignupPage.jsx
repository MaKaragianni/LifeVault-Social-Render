import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../services/authentication";
import logo from "../../assets/lifevault_logo_v5.png";

import "./SignupPage.css";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  function validatePassword(password) {
    const pattern =
      /(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])/;
    if (!pattern.test(password)) {
      setError(
        "Password must contain at least 1 capital letter, a number and a special character!",
      );
      return false;
    } else if (password.length < 8 || password.length > 12) {
      setError("Password must be between 8 and 12 characters long");
      return false;
    } else {
      return true;
    }
  }

  function matchPasswords(password, confirmPassword) {
    if (password === confirmPassword) {
      return true;
    }
    setError("Passwords don't match");
    return false;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      validatePassword(password) &&
      matchPasswords(password, confirmPassword)
    ) {
      try {
        await signup(email, password, confirmPassword, username, profilePic, bio);
        navigate("/login");
      } catch (err) {
        console.error(err);
        navigate("/signup");
      }
    }
  }

  async function handleProfilePicChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setProfilePic(data.imageUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Image upload failed");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleBioChange(event) {
    setBio(event.target.value);
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src={logo} alt="logo" className="auth-logo" />
        <h2>Create your account</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />

          <label htmlFor="profilePic">Profile Picture</label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
          />

          <label htmlFor="bio">Bio</label>
          <input id="bio" value={bio} onChange={handleBioChange} />

          <input
            role="submit-button"
            id="submit"
            type="submit"
            value="Submit"
            className="btn btn-primary"
          />
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}