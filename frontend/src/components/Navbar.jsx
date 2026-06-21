import LogoutButton from "../components/LogoutButton";
import logo from "../assets/lifevault_logo_v8_cream.png";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const userId = localStorage.getItem("userId");

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="logo" className="navbar-logo" />
      </div>
      <div className="navbar-centre">
        <Link to="/posts" className="nav-link">Feed</Link>
        <Link to={`/profile/${userId}`} className="nav-link">Profile</Link>
        <Link to="/following" className="nav-link">Following</Link>
        <Link to="/friend-requests" className="nav-link">Friend Requests</Link>
        <Link to="/forgot-password" className="nav-link">Forgot Password</Link>
      </div>
      <div className="navbar-right">
        <LogoutButton />
      </div>
    </nav>
  );
}