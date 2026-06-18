import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../../services/users";
import Post from "../../components/Post";
import LogoutButton from "../../components/LogoutButton";
import AddFriendButton from "../../components/FollowButton";

function getUserIdFromToken() {
  return localStorage.getItem("userId");
}

export function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = id || getUserIdFromToken();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      navigate("/login");
      return;
    }

    setLoading(true);

    getUser(userId)
      .then((userData) => {
        setUser(userData.user);
        setPosts(userData.posts);
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <>
      <h2>Profile</h2>

      <img src={user.profilePic} alt="Profile" width="200" />

      <div>
        <p>Username: {user.username}</p>
        <p>Bio: {user.bio}</p>
        <AddFriendButton />
        <br></br>
        <br></br>
      </div>

      <div className="feed" role="feed">
                {posts.map((post) => (
                    <Post post={post} key={post._id} />
                ))}
            </div>

      <LogoutButton />
    </>
  );
}
