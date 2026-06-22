import { useEffect, useState } from "react";
import { getFriends } from "../../services/friends";
import Navbar from "../../components/Navbar";
import "./FriendsPage.css";

function FriendsPage() {
  const [friends, setFriends] = useState([]);

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
        <h1>Friends</h1>

        {friends.length === 0 ? (
          <p>No friends found.</p>
        ) : (
          <div className="friends-grid">
            {friends.map((friend) => (
              <div key={friend._id} className="friend-card">
                <img
                  src={friend.profilePic || "placeholder-avatar.png"}
                  alt={friend.username}
                />
                <h3>{friend.username}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FriendsPage;