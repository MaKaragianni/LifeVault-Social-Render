import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import { createPost } from "../../services/createPost";
import Navbar from "../../components/Navbar";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await createPost(token, message);
      const updatedPosts = await getPosts(token);
      setPosts(updatedPosts.posts);

      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  return (
    <>
      <Navbar />
      <div 
        className="page-content" 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          padding: "20px" 
        }}
      >
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <h2>Posts</h2>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What's on your mind?"
              rows="4"
              style={{
                width: "100%",
                minHeight: "120px",
                resize: "vertical",
                boxSizing: "border-box",
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                background: "#ffffff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                fontFamily: "system-ui",
                fontSize: "1.1rem",
                outline: "none",
                color: "#413933",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  background: "#4C4C34",
                  color: "#EBDED0",
                  fontFamily: "system-ui",
                  fontSize: "1rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Post
              </button>
            </div>
          </form>

          <div 
            className="feed" 
            role="feed" 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "15px",
              marginTop: "20px" 
            }}
          >
            {posts.map((post) => (
              <div key={post._id} style={{ width: "100%" }}>
                <Post post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}