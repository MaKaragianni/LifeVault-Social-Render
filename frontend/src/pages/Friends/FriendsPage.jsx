import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFriends } from "../../services/friends";
import Navbar from "../../components/Navbar";
import "./FriendsPage.css";

function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFriends() {
      try {
        const token = localStorage.getItem("token");
        const data = await getFriends(token);
        setFriends(data.friends || data || []);
      } catch (error) {
        console.error(error);
      }
    }

    loadFriends();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-content">
        <h1 style={{ color: "#4C4C34", marginBottom: "20px" }}>Friends</h1>

        {friends.length === 0 ? (
          <p style={{ color: "#65676B" }}>No friends found.</p>
        ) : (
          <div className="friends-grid">
            {friends.map((friend) => (
              <div 
                key={friend._id} 
                className="friend-card"
                onClick={() => navigate(`/profile/${friend._id}`)}
                style={{ 
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease" 
                }}
              >
                <img
                  src={friend.profilePic || "placeholder-avatar.png"}
                  alt={friend.username}
                  style={{ objectFit: "cover" }}
                />
                <h3 style={{ color: "#4C4C34", fontWeight: "700", marginTop: "10px" }}>
                  {friend.username}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FriendsPage;