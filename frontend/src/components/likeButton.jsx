import { useState } from "react";
import { likePost } from "../services/posts";

function LikeButton({ post, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  const likedByUser = post.likes?.some((id) => id.toString() === currentUserId) || false;

  async function handleLike() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = await likePost(token, post._id);

      onUpdate(data.likes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
        onClick={handleLike}
        disabled={loading}
        style={{
            background: "transparent",
            fontSize: "20px",
            border: "none",
            cursor: "pointer",
            color: "#4C4C34",
            display: "flex",
            alignItems: "center",
            gap: "5px"
        }}
    >
        <span 
            style={
              likedByUser
                  ? { color: "transparent", textShadow: "0 0 0 #4C4C34" }
                  : {}
            }
        >   {likedByUser ? "💚" : "♡"}
        </span> 

        <span style={{ fontSize: "15px"}}>
          {post.likes?.length || 0}
        </span>
    </button>
  );

} 

export default LikeButton;