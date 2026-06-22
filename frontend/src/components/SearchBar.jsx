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
    if (e) e.preventDefault(); 
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Ensure token is passed cleanly here to the service
        const result = await searchUsers(token, searchQuery);
        setSearchResult(result);
        setError(""); 
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
            <div 
              key={user._id} 
              onClick={() => {
                setSearchResult([]); 
                setSearchQuery("");
                navigate(`/profile/${user._id}`);
              }}
              style={{ cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}
            >
              <User friend={user} />
            </div>
          ))}
          {error && <p style={{ color: "red", margin: 0, fontSize: "0.9rem" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default SearchBar;