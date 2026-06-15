import { useState } from "react";
import { searchUsers } from "../services/friends";
import { useNavigate } from "react-router-dom";
import User from "../components/User";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token !== null) {
        const result = await searchUsers(token, searchQuery);
        setSearchResult(result);
      } else {
        navigate("/login");
      }
    } catch {
      setError("No user found");
    }
  };

  return (
    <div style={{ alignItems: "center" }}>
      <input
        onChange={(event) => {
          setSearchQuery(event.target.value);
        }}
      />
      <button onClick={handleSearch} className="search-button" type="submit">
        Search
      </button>
      <br></br>
      <br></br>
      <div>
        {searchResult.map((user) => (
          <User key={user._id} friend={user} />
        ))}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default SearchBar;
