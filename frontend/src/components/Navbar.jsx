import LogoutButton from "../components/LogoutButton";
import logo from "../assets/lifevault_logo_v8_cream.png";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="logo" className="navbar-logo" />
      </div>
      <div className="navbar-centre">
        <Link to="/posts" className="nav-link">
          Feed
        </Link>
        <Link to={`/profile/${localStorage.getItem("userId")}`} className="nav-link">
          Profile
        </Link>
        <Link to="/following" className="nav-link">
          Following
        </Link>
      </div>
      <div className="navbar-right">
        <LogoutButton />
      </div>
    </nav>
  );
}

export default Navbar; 
