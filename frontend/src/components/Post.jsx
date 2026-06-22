import { useNavigate } from "react-router-dom";
import LikeButton from "./likeButton";
import { useState } from "react";

function Post({ post: initialPost }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(initialPost);

  return (
    <article
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        width: "100%",
        boxSizing: "border-box",
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)"
      }}
    >
      <div
        onClick={() => post.user?._id && navigate(`/profile/${post.user._id}`)}
        style={{
          cursor: post.user?._id ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "14px"
        }}
      >
        <img
          src={post.user?.profilePic || "https://via.placeholder.com/40"}
          alt=""
          width="40"
          height="40"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <strong style={{ color: "#4C4C34", fontSize: "1.05rem" }}>
          {post.user?.username || "Anonymous User"}
        </strong>
      </div>
      
      {post.message && (
        <p style={{ fontSize: "1.05rem", lineHeight: "1.45", margin: "0 0 14px 0", color: "#333" }}>
          {post.message}
        </p>
      )}

      {post.image && (
        <div style={{ margin: "0 -20px 14px -20px", background: "#f0f2f5", overflow: "hidden" }}>
          <img
            src={post.image}
            alt="Attached content media snapshot"
            style={{
              width: "100%",
              maxHeight: "450px",
              objectFit: "cover",
              display: "block"
            }}
          />
        </div>
      )}

      <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
        <LikeButton
          post={post}
          onUpdate={(updatedLikes) => 
            setPost({
              ...post,
              likes: updatedLikes,
            })
          }
        />
      </div>
    </article>
  );
}

export default Post;