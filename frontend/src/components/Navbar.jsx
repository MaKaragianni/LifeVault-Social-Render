import LogoutButton from "../components/LogoutButton";
import logo from "../assets/lifevault_logo_v8_cream.png";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const userId = localStorage.getItem("userId");

  return (
    <nav className="navbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px" }}>
      <div className="navbar-left" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img src={logo} alt="logo" className="navbar-logo" style={{ height: "150px", width: "auto", objectFit: "contain" }} />
        <SearchBar />
      </div>
      
      <div className="navbar-centre" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link to="/posts" className="nav-link">Feed</Link>
        <Link to={`/profile/${userId}`} className="nav-link">Profile</Link>
        <Link to="/friends" className="nav-link">Friends</Link>
      </div>
      
      <div className="navbar-right">
        <LogoutButton />
      </div>
    </nav>
  );
}