import { useNavigate } from "react-router-dom";
import LikeButton from "./likeButton";
import { useState, useEffect } from "react";

function Post({ post: initialPost }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(initialPost);
  const currentUserId = localStorage.getItem("userId");

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [postMessage, setPostMessage] = useState(post.message || "");

  const [comments, setComments] = useState(post.comments || []);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    if (initialPost && initialPost.comments) {
      setComments(initialPost.comments);
    }
    if (initialPost) {
      setPost(initialPost);
      setPostMessage(initialPost.message || "");
    }
  }, [initialPost]);

  const handleUpdatePost = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/posts/${post._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: postMessage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    const data = await response.json();

    setPost({
      ...post,
      message: data.post.message,
    });

    setIsEditingPost(false);
  } catch (err) {
    console.error("Failed to update post:", err);
  }
};

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newCommentText }),
      });

      if (res.ok) {
        const data = await res.json();
        const backendCommentWithUserObj = {
          ...data.comment,
          likes: [], 
          user: {
            _id: currentUserId,
            username: localStorage.getItem("username") || "Me",
          }
        };
        setComments([...comments, backendCommentWithUserObj]);
        setNewCommentText("");
      }
    } catch (err) {
      console.error("Failed to add live comment:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    setComments(prevComments =>
      prevComments.map((c) => {
        if (c._id === commentId) {
          const currentLikesArray = Array.isArray(c.likes) ? c.likes : [];
          const hasLiked = currentLikesArray.includes(currentUserId);
          
          const updatedLikes = hasLiked
            ? currentLikesArray.filter(id => id !== currentUserId)
            : [...currentLikesArray, currentUserId];

          return {
            ...c,
            likes: updatedLikes
          };
        }
        return c;
      })
    );

    try {
      const token = localStorage.getItem("token");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await fetch(`${API_BASE}/posts/${post._id}/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.comment || data.likes) {
          setComments(prev => prev.map(c => 
            c._id === commentId ? { ...c, likes: data.comment?.likes || data.likes } : c
          ));
        }
      }
    } catch (err) {
      console.error("Database comment like sync error:", err);
    }
  };

  const handleSaveCommentEdit = async (commentId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/posts/${post._id}/comments/${commentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: editingCommentText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update comment");
    }

    const data = await response.json();

    setComments(
      comments.map((c) =>
        c._id === commentId
          ? { ...c, message: data.comment.message }
          : c
      )
    );

    setEditingCommentId(null);
    setEditingCommentText("");
  } catch (err) {
    console.error("Failed to update comment:", err);
  }
};

  return (
    <article
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        width: "100%",
        boxSizing: "border-box",
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        marginBottom: "20px",
      }}
    >
      {/* Header Alignment */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "14px",
          width: "100%"
        }}
      >
        <div
          onClick={() => post.user?._id && navigate(`/profile/${post.user._id}`)}
          style={{
            cursor: post.user?._id ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img
            src={post.user?.profilePic || "https://via.placeholder.com/40"}
            alt=""
            width="40"
            height="40"
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <strong style={{ color: "#4C4C34", fontSize: "1.05rem" }}>
            {post.user?.username || "Anonymous User"}
          </strong>
        </div>

        {post.user?._id === currentUserId && !isEditingPost && (
          <button
            onClick={() => setIsEditingPost(true)}
            style={{
              background: "none",
              border: "none",
              color: "#8c7c70",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "0.85rem",
            }}
          >
            Edit Post
          </button>
        )}
      </div>

      {isEditingPost ? (
        <div style={{ marginBottom: "14px" }}>
          <textarea
            value={postMessage}
            onChange={(e) => setPostMessage(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "8px", justifyContent: "flex-end" }}>
            <button onClick={() => setIsEditingPost(false)} style={{ background: "#ccc", border: "none", padding: "4px 10px", borderRadius: "4px" }}>Cancel</button>
            <button onClick={handleUpdatePost} style={{ background: "#4C4C34", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px" }}>Save</button>
          </div>
        </div>
      ) : (
        post.message && (
          <p style={{ fontSize: "1.05rem", lineHeight: "1.45", margin: "0 0 14px 0", color: "#333", textAlign: "left" }}>
            {post.message}
          </p>
        )
      )}

      {post.image && (
        <div style={{ margin: "0 -20px 14px -20px", background: "#f0f2f5", overflow: "hidden" }}>
          <img src={post.image} alt="Attached content" style={{ width: "100%", maxHeight: "450px", objectFit: "cover", display: "block" }} />
        </div>
      )}

      <div style={{ borderTop: "1px solid #eee", paddingTop: "10px", paddingBottom: "10px" }}>
        <LikeButton
          post={post}
          onUpdate={(updatedLikes) => setPost({ ...post, likes: updatedLikes })}
        />
      </div>

      {/* Comments section */}
      <div style={{ background: "#fdfbfa", padding: "12px", borderRadius: "6px", borderTop: "1px solid #f1f1f1", marginTop: "10px", textAlign: "left" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#4C4C34" }}>Comments</h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {comments.map((comment) => {
            const likesList = Array.isArray(comment.likes) ? comment.likes : [];
            const userHasLikedComment = likesList.includes(currentUserId);
            const totalLikesCount = likesList.length;

            return (
              <div key={comment._id} style={{ fontSize: "0.9rem", borderBottom: "1px solid #f3f0ec", paddingBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "#4C4C34" }}>
                    {comment.user?.username || "Someone"}
                  </strong>
                  {comment.user?._id === currentUserId && (
                    <button
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditingCommentText(comment.message); 
                      }}
                      style={{ background: "none", border: "none", color: "#8c7c70", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingCommentId === comment._id ? (
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                    <input
                      type="text"
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      style={{ flexGrow: 1, padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                    <button onClick={() => handleSaveCommentEdit(comment._id)} style={{ background: "#4C4C34", color: "#fff", border: "none", padding: "2px 8px", borderRadius: "4px" }}>Save</button>
                    <button onClick={() => { setEditingCommentId(null); setEditingCommentText(""); }} style={{ background: "#ccc", border: "none", padding: "2px 8px", borderRadius: "4px" }}>Cancel</button>
                  </div>
                ) : (
                  <p style={{ margin: "4px 0", color: "#444" }}>{comment.message}</p>
                )}

                <button
                  onClick={() => handleLikeComment(comment._id)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "0.8rem",
                    color: userHasLikedComment ? "#2e7d32" : "#777",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "4px",
                    fontWeight: userHasLikedComment ? "bold" : "normal"
                  }}
                >
                  {userHasLikedComment ? "👍 Liked" : "👍 Like"} ({totalLikesCount})
                </button>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleAddComment} style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            style={{ flexGrow: 1, padding: "6px 10px", fontSize: "0.85rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button type="submit" style={{ background: "#4C4C34", color: "#EBDED0", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>Send</button>
        </form>
      </div>
    </article>
  );
}

export default Post;