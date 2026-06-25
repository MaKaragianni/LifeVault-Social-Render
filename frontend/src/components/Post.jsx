import { useNavigate } from "react-router-dom";
import LikeButton from "./likeButton";
import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const CLOUDINARY_CLOUD = "dg1scdvos";
const CLOUDINARY_PRESET = "e8k3rygc";

function Post({ post: initialPost }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(initialPost);
  const currentUserId = localStorage.getItem("userId");

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [postMessage, setPostMessage] = useState(post.message || "");

  // Image editing state
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(post.image || "");
  const [imageRemoved, setImageRemoved] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);

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
    }
  }, [initialPost]);

  const handleStartEditPost = () => {
    setPostMessage(post.message || "");
    setEditImagePreview(post.image || "");
    setEditImageFile(null);
    setImageRemoved(false);
    setIsEditingPost(true);
  };

  const handleCancelEditPost = () => {
    setIsEditingPost(false);
    setEditImageFile(null);
    setEditImagePreview(post.image || "");
    setImageRemoved(false);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
      setImageRemoved(false);
    }
  };

  const handleRemoveImage = () => {
    setEditImageFile(null);
    setEditImagePreview("");
    setImageRemoved(true);
  };

  const handleUpdatePost = async () => {
    setUploadingEdit(true);
    try {
      const token = localStorage.getItem("token");
      let finalImageUrl = post.image || "";

      // Upload new image if one was selected
      if (editImageFile) {
        const formData = new FormData();
        formData.append("file", editImageFile);
        formData.append("upload_preset", CLOUDINARY_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
          { method: "POST", body: formData }
        );
        if (res.ok) {
          const data = await res.json();
          finalImageUrl = data.secure_url;
        }
      } else if (imageRemoved) {
        finalImageUrl = "";
      }

      // Save the updated post to the backend
      const res = await fetch(`${BACKEND_URL}/posts/${post._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: postMessage, image: finalImageUrl }),
      });

      if (res.ok) {
        setPost({ ...post, message: postMessage, image: finalImageUrl });
      }
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setUploadingEdit(false);
      setIsEditingPost(false);
      setEditImageFile(null);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
          },
        };
        setComments([...comments, backendCommentWithUserObj]);
        setNewCommentText("");
      }
    } catch (err) {
      console.error("Failed to add live comment:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    setComments((prevComments) =>
      prevComments.map((c) => {
        if (c._id === commentId) {
          const currentLikesArray = Array.isArray(c.likes) ? c.likes : [];
          const hasLiked = currentLikesArray.includes(currentUserId);
          return {
            ...c,
            likes: hasLiked
              ? currentLikesArray.filter((id) => id !== currentUserId)
              : [...currentLikesArray, currentUserId],
          };
        }
        return c;
      })
    );

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/posts/${post._id}/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.comment || data.likes) {
          setComments((prev) =>
            prev.map((c) =>
              c._id === commentId
                ? { ...c, likes: data.comment?.likes || data.likes }
                : c
            )
          );
        }
      }
    } catch (err) {
      console.error("Database comment like sync error:", err);
    }
  };

  const handleSaveCommentEdit = (commentId) => {
    setComments(
      comments.map((c) =>
        c._id === commentId ? { ...c, message: editingCommentText } : c
      )
    );
    setEditingCommentId(null);
    setEditingCommentText("");
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
          width: "100%",
        }}
      >
        <div
          onClick={() =>
            post.user?._id && navigate(`/profile/${post.user._id}`)
          }
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
            onClick={handleStartEditPost}
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

      {/* Edit mode */}
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
              marginBottom: "10px",
            }}
          />

          {/* Image preview / remove / change controls */}
          {editImagePreview ? (
            <div style={{ position: "relative", marginBottom: "10px" }}>
              <img
                src={editImagePreview}
                alt="Post"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  display: "flex",
                  gap: "6px",
                }}
              >
                {/* Change image */}
                <label
                  style={{
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  Change
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    style={{ display: "none" }}
                  />
                </label>
                {/* Remove image */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    background: "rgba(180,0,0,0.75)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            // No image — offer to add one
            <label
              style={{
                display: "inline-block",
                marginBottom: "10px",
                padding: "5px 12px",
                background: "#f0ece6",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "#4C4C34",
                border: "1px dashed #aaa",
              }}
            >
              + Add Image
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                style={{ display: "none" }}
              />
            </label>
          )}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "8px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleCancelEditPost}
              style={{
                background: "#ccc",
                border: "none",
                padding: "4px 10px",
                borderRadius: "4px",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePost}
              disabled={uploadingEdit}
              style={{
                background: "#4C4C34",
                color: "#fff",
                border: "none",
                padding: "4px 10px",
                borderRadius: "4px",
                opacity: uploadingEdit ? 0.6 : 1,
              }}
            >
              {uploadingEdit ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        post.message && (
          <p
            style={{
              fontSize: "1.05rem",
              lineHeight: "1.45",
              margin: "0 0 14px 0",
              color: "#333",
              textAlign: "left",
            }}
          >
            {post.message}
          </p>
        )
      )}

      {/* Post image (view mode only) */}
      {!isEditingPost && post.image && (
        <div
          style={{
            margin: "0 -20px 14px -20px",
            background: "#f0f2f5",
            overflow: "hidden",
          }}
        >
          <img
            src={post.image}
            alt="Attached content"
            style={{
              width: "100%",
              maxHeight: "450px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      <div
        style={{
          borderTop: "1px solid #eee",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <LikeButton
          post={post}
          onUpdate={(updatedLikes) => setPost({ ...post, likes: updatedLikes })}
        />
      </div>

      {/* Comments section */}
      <div
        style={{
          background: "#fdfbfa",
          padding: "12px",
          borderRadius: "6px",
          borderTop: "1px solid #f1f1f1",
          marginTop: "10px",
          textAlign: "left",
        }}
      >
        <h4
          style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#4C4C34" }}
        >
          Comments
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {comments.map((comment) => {
            const likesList = Array.isArray(comment.likes) ? comment.likes : [];
            const userHasLikedComment = likesList.includes(currentUserId);
            const totalLikesCount = likesList.length;

            return (
              <div
                key={comment._id}
                style={{
                  fontSize: "0.9rem",
                  borderBottom: "1px solid #f3f0ec",
                  paddingBottom: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <strong style={{ color: "#4C4C34" }}>
                    {comment.user?.username || "Someone"}
                  </strong>
                  {comment.user?._id === currentUserId && (
                    <button
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditingCommentText(comment.message);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#8c7c70",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingCommentId === comment._id ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginTop: "4px",
                    }}
                  >
                    <input
                      type="text"
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      style={{
                        flexGrow: 1,
                        padding: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <button
                      onClick={() => handleSaveCommentEdit(comment._id)}
                      style={{
                        background: "#4C4C34",
                        color: "#fff",
                        border: "none",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingCommentText("");
                      }}
                      style={{
                        background: "#ccc",
                        border: "none",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p style={{ margin: "4px 0", color: "#444" }}>
                    {comment.message}
                  </p>
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
                    fontWeight: userHasLikedComment ? "bold" : "normal",
                  }}
                >
                  {userHasLikedComment ? "👍 Liked" : "👍 Like"} (
                  {totalLikesCount})
                </button>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleAddComment}
          style={{ display: "flex", gap: "8px", marginTop: "12px" }}
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            style={{
              flexGrow: 1,
              padding: "6px 10px",
              fontSize: "0.85rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#4C4C34",
              color: "#EBDED0",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </article>
  );
}

export default Post;