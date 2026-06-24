import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/lifevault_logo_v5.png";
import { login } from "../../services/authentication";
import "./LoginPage.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="logo" className="auth-logo" />
        <h2>Log In</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />

          <button
            role="submit-button"
            type="submit"
            className="btn btn-primary auth-submit"
          >
            Log In
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}