import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function validatePassword(password) {
    console.log("validating:", password);
    const pattern =
      /(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])/;
    if (!pattern.test(password)) {
      setError("Password must contain at least 1 capital letter, a number and a special character!");
      return false;
    } else if (password.length < 8 || password.length > 12) {
      setError("Password must be between 8 and 12 characters long");
      return false;
    } else {
      return true;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (validatePassword(password)) {
      try {
        await signup(email, password);
        navigate("/login");
      } catch (err) {
        console.error(err);
        navigate("/signup");
      }
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          />
        <label htmlFor="password">Password:</label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}
