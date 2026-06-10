import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authentication";

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
    console.log("validating:", password);
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
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      validatePassword(password) &&
      matchPasswords(password, confirmPassword)
    ) {
      try {
        await signup(email, password);
        navigate("/login");
      } catch (err) {
        console.error(err);
        navigate("/signup");
      }
    try {
      await signup(email, password, username, profilePic, bio);
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/signup");
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
  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleProfilePicChange(event) {
    setProfilePic(event.target.value);
  }

  function handleBioChange(event) {
    setBio(event.target.value);
  }

  return (
    <>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email: </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <br></br>
        <br></br>
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <label htmlFor="confirm-password"> Confirm Password:</label>
        <input
          placeholder="Confirm Password"
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <br></br>
        <br></br>
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        <br></br>
        <br></br>
        <label htmlFor="profilePic">Profile Picture: </label>
        <input
          id="profilePic"
          type="file"
          value={profilePic}
          onChange={handleProfilePicChange}
        />
        <br></br>
        <br></br>
        <label htmlFor="bio">Bio: </label>
        <input
          id="bio"
          value={bio}
          onChange={handleBioChange}
        />
        <br></br>
        <br></br>
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
