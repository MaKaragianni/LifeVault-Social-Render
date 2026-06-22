import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../../services/users";
import Post from "../../components/Post";
import Navbar from "../../components/Navbar";

function getUserIdFromToken() {
  return localStorage.getItem("userId");
}

export function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const targetUserId = id || getUserIdFromToken();
  const loggedInUserId = getUserIdFromToken();
  const isOwnProfile = !id || id === loggedInUserId;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState("");

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      navigate("/login");
      return;
    }

    setLoading(true);

    getUser(targetUserId)
      .then((userData) => {
        setUser(userData.user);
        setBioText(userData.user.bio || "");
        setPosts(userData.posts);
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [targetUserId, navigate]);

  const handleAddFriend = () => {
    alert("Friend Request Sent!");
  };

  const handleSaveBio = () => {
    setUser({ ...user, bio: bioText });
    setIsEditing(false);
    alert("Bio updated locally!"); 
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

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

          <p style={{ fontSize: "1.1rem" }}><strong>Username: </strong>{user.username}</p>
          
          <div style={{ margin: "10px 0" }}>
            <strong>Bio: </strong>
            {isEditing ? (
              <div style={{ marginTop: "5px" }}>
                <textarea 
                  value={bioText} 
                  onChange={(e) => setBioText(e.target.value)}
                  style={{ width: "80%", padding: "5px", borderRadius: "4px" }}
                />
                <br />
                <button onClick={handleSaveBio} style={{ ...actionButtonStyle, width: "80px", height: "30px", lineHeight: "30px", marginTop: "5px", background: "#2e7d32" }}>Save</button>
              </div>
            ) : (
              <span style={{ fontSize: "1.05rem", color: "#60554c" }}>{user.bio || "No bio yet."}</span>
            )}
          </div>
          
          {/* Action Button Box */}
          <div style={{ marginTop: "20px", marginBottom: "40px" }}>
            {isOwnProfile ? (
              <button onClick={() => setIsEditing(!isEditing)} style={actionButtonStyle}>
                ⚙️ Edit Profile
              </button>
            ) : (
              <button onClick={handleAddFriend} style={actionButtonStyle}>
                <span style={{ color: "#EBDED0", marginRight: "4px" }}>＋</span> Add Friend
              </button>
            )}
          </div>

          <div className="feed" role="feed" style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
            {posts.map((post) => (
              <Post post={post} key={post._id} />
            ))}
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
  textAlign: "center"
};