import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authentication";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
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
    </>
  );
}
