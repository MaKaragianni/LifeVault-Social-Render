import { useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "../components/User";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const queryTerm = searchQuery.trim();
    if (!queryTerm) return;

    try {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userId");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/users/search?username=${encodeURIComponent(queryTerm)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setError("No user found");
        setSearchResult([]);
        return;
      }

      const data = await response.json();

      const rawUsers = Array.isArray(data)
        ? data
        : data.users || data.data || [];

      // Exclude self from results (the backend also excludes via req.user_id)
      const filtered = rawUsers.filter(
        (user) => user && user._id !== currentUserId
      );

      if (filtered.length === 0) {
        setError("No user found");
        setSearchResult([]);
      } else {
        setSearchResult(filtered);
        setError("");
      }
    } catch (err) {
      console.error("Search error:", err);
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          style={{
            padding: "6px 12px",
            fontSize: "0.9rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            outline: "none",
            width: "180px",
            color: "#413933",
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

      {(searchResult.length > 0 || error) && (
        <div
          style={{
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
            minWidth: "220px",
          }}
        >
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
          {error && (
            <p style={{ color: "red", margin: 0, fontSize: "0.9rem" }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;