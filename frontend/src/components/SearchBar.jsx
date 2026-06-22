import { useState } from "react";
import { searchUsers } from "../services/friends";
import { useNavigate } from "react-router-dom";
import User from "../components/User";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    if (e) e.preventDefault(); // Prevent accidental form submissons if wrapped in a form
    try {
      const token = localStorage.getItem("token");
      if (token !== null) {
        const result = await searchUsers(token, searchQuery);
        setSearchResult(result);
        setError(""); // Clear any previous errors
      } else {
        navigate("/login");
      }
    } catch {
      setError("No user found");
      setSearchResult([]);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            padding: "6px 12px",
            fontSize: "0.9rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            outline: "none",
            width: "180px",
            color: "#413933"
          }}
        />
        <button
          onClick={handleSearch}
          className="search-button"
          type="button"
          style={{
            padding: "6px 12px",
            background: "#EBDED0",
            color: "#4C4C34",
            fontFamily: "system-ui",
            fontSize: "0.9rem",
            fontWeight: "bold",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Floating Search Results Dropdown */}
      {(searchResult.length > 0 || error) && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "#ffffff",
          border: "1px solid #ccc",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
          marginTop: "8px",
          maxHeight: "300px",
          overflowY: "auto",
          padding: "10px",
          width: "max-content",
          minWidth: "220px"
        }}>
          {searchResult.map((user) => (
            <User key={user._id} friend={user} />
          ))}
          {error && <p style={{ color: "red", margin: 0, fontSize: "0.9rem" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default SearchBar;