import { Link } from "react-router-dom";
import logo from "../../assets/lifevault_logo_v5.png";

import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home-container">
      <div className="home-card">
        <img
          src={logo}
          alt="logo"
          className="auth-logo"
        />
        <h1>Welcome to LifeVault!</h1>
        <p>Connect. Share. Thrive.</p>
        <p>Where friends meet and moments live.</p>
        <div className="home-actions">
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          <Link to="/login" className="btn btn-secondary">Log In</Link>
        </div>
      </div>
    </div>
  );
}