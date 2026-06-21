import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../../services/users";
import Post from "../../components/Post";
import FollowButton from "../../components/FollowButton";
import Navbar from "../../components/Navbar";
import { sendFriendRequest } from "../../services/friendRequests";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
  const { username } = useParams();

  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadUser();
  }, [username]);

  async function loadUser() {
    const res = await fetch(
      `${API_URL}/users/username/${username}`
    );

  const data = await res.json();
    setUser(data);
  }

  async function addFriend() {
    await sendFriendRequest(user._id, token);
    alert("Friend request sent");
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user.username}</h1>

      <p>{user.bio}</p>

      <button onClick={addFriend}>
        Add Friend
      </button>
    </div>
  );
}  

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
      <Navbar />
      <div className="page-content">
        <h2>Profile</h2>

        <img className="profile-pic" src={user.profilePic} alt="Profile" width="200" />

        <p><strong>Username: </strong>{user.username}</p>
        <p><strong>Bio: </strong>{user.bio}</p>
        {id !== localStorage.getItem("userId") && <FollowButton />}
        <br></br>
        <br></br>

        <div className="feed" role="feed">
          {posts.map((post) => (
            <Post post={post} key={post._id} />
          ))}
        </div>
      </div>
    </>
  );
}
