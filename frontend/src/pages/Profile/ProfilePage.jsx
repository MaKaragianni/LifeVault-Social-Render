import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Post from "../../components/Post";
import Navbar from "../../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem("userId");
  const targetUserId = id || loggedInUserId;
  const isOwnProfile = !id || id === loggedInUserId;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState("");
  const [usernameText, setUsernameText] = useState(""); 

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/users/${targetUserId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      const userData = await res.json();
      const activeUser = userData.user || userData;
      
      setUser(activeUser);
      setBioText(activeUser?.bio || "");
      setUsernameText(activeUser?.username || "");
      setPosts(userData.posts || []);
      setFriendRequests(activeUser?.friendRequests || []);
    } catch (err) {
      console.error("ProfilePage load error:", err);
      setError("Could not load profile. Please try again.");
      setUser(null);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!targetUserId) {
      navigate("/login");
      return;
    }
    loadProfileData();
  }, [targetUserId, navigate]);

  // Check if logged-in user is already a friend of this profile target
  const isAlreadyFriend = user?.friends?.some(f => {
    const friendId = typeof f === "object" ? f._id : f;
    return String(friendId) === String(loggedInUserId);
  });

  const handleAddFriend = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/${targetUserId}/friendRequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        alert("Friend Request Sent!");
      }
    } catch (err) {
      console.error(err);
      alert("Friend Request Sent!");
    }
  };

  const handleRemoveFriend = async () => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/${targetUserId}/unfriend`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        alert("Removed from friends list.");
        await loadProfileData();
      }
    } catch (err) {
      console.error(err);
      setUser(prev => ({
        ...prev,
        friends: prev.friends.filter(f => (typeof f === 'object' ? f._id : f) !== loggedInUserId)
      }));
    }
  };

  const handleAcceptFriend = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/friendRequest/${requestId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Friend request accepted!");
        await loadProfileData(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectFriend = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/users/friendRequest/${requestId}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Friend request removed.");
        await loadProfileData(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setUser({ ...user, username: usernameText, bio: bioText });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelChanges = () => {
    setBioText(user?.bio || "");
    setUsernameText(user?.username || "");
    setIsEditing(false);
  };

  if (loading)
    return <p style={{ padding: "30px", fontSize: "1.2rem", color: "#4C4C34" }}>Loading profile...</p>;

  if (error)
    return (
      <>
        <Navbar />
        <p style={{ padding: "30px", color: "#d32f2f" }}>{error}</p>
      </>
    );

  if (!user)
    return (
      <>
        <Navbar />
        <p style={{ padding: "30px", color: "#4C4C34" }}>User not found.</p>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="page-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: "600px", textAlign: "center", color: "#4C4C34" }}>
          <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>Profile</h2>

          <img
            className="profile-pic"
            src={user.profilePic || "https://via.placeholder.com/200"}
            alt="Profile"
            style={{ width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover", border: "4px solid #4C4C34", marginBottom: "15px" }}
          />

          <div style={{ margin: "10px 0", fontSize: "1.1rem" }}>
            <strong>Username: </strong>
            {isEditing ? (
              <input
                type="text"
                value={usernameText}
                onChange={(e) => setUsernameText(e.target.value)}
                style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc", marginLeft: "5px" }}
              />
            ) : (
              <span>{user.username}</span>
            )}
          </div>

          <div style={{ margin: "10px 0" }}>
            <strong>Bio: </strong>
            {isEditing ? (
              <div style={{ marginTop: "5px" }}>
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  style={{ width: "80%", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <br />
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
                  <button onClick={handleSaveChanges} style={{ ...actionButtonStyle, width: "80px", height: "30px", lineHeight: "30px", background: "#2e7d32" }}>Save</button>
                  <button onClick={handleCancelChanges} style={{ ...actionButtonStyle, width: "80px", height: "30px", lineHeight: "30px", background: "#d32f2f" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <span style={{ fontSize: "1.05rem", color: "#60554c" }}>{user.bio || "No bio yet."}</span>
            )}
          </div>

          {/* Action Button Section with Conditional Friends Mapping Logic */}
          <div style={{ marginTop: "20px", marginBottom: "40px" }}>
            {isOwnProfile ? (
              !isEditing && <button onClick={() => setIsEditing(true)} style={actionButtonStyle}>⚙️ Edit Profile</button>
            ) : isAlreadyFriend ? (
              <button onClick={handleRemoveFriend} style={{ ...actionButtonStyle, background: "#d32f2f" }}>❌ Unfriend</button>
            ) : (
              <button onClick={handleAddFriend} style={actionButtonStyle}>
                <span style={{ color: "#EBDED0", marginRight: "4px" }}>＋</span> Add Friend
              </button>
            )}
          </div>

          {/* Friend Requests Interface */}
          {isOwnProfile && friendRequests.length > 0 && (
            <div style={{ background: "#ffffff", borderRadius: "8px", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)", padding: "16px", marginBottom: "20px", width: "100%", maxWidth: "600px", boxSizing: "border-box", textAlign: "left", fontFamily: "Segoe UI, Helvetica, Arial, sans-serif" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#65676B", fontSize: "16px", fontWeight: "600" }}>Friend Requests</h4>
              {friendRequests.map((req) => (
                <div key={req._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
                  <div onClick={() => navigate(`/profile/${req._id}`)} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                    <img src={req.profilePic || "https://via.placeholder.com/40"} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} alt=""/>
                    <span style={{ fontWeight: "700", color: "#4C4C34", fontSize: "1.05rem" }}>
                      {req.username || "Someone"}{" "}
                      <span style={{ fontWeight: "normal", color: "#65676B", fontSize: "0.95rem" }}>wants to be friends</span>
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleAcceptFriend(req._id)} style={{ background: "#1877F2", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>Confirm</button>
                    <button onClick={() => handleRejectFriend(req._id)} style={{ background: "#E4E6EB", color: "#050505", border: "none", padding: "8px 12px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Posts Feed */}
          <div className="feed" role="feed" style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
            {Array.isArray(posts) && posts.map((post) => <Post post={post} key={post._id || post.id} />)}
          </div>
        </div>
      </div>
    </>
  );
}

const actionButtonStyle = {
  width: "140px",
  height: "40px",
  lineHeight: "40px",
  boxSizing: "border-box",
  padding: "0",
  background: "#4C4C34",
  color: "#EBDED0",
  fontFamily: "system-ui",
  fontSize: "0.95rem",
  fontWeight: "bold",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  textAlign: "center",
};