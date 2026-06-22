import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import { createPost } from "../../services/createPost";
import Navbar from "../../components/Navbar";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = localStorage.getItem("token");
      let uploadedUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "e8k3rygc"); 

        const cloudinaryRes = await fetch(
          "https://api.cloudinary.com/v1_1/dg1scdvos/image/upload",
          { method: "POST", body: formData }
        );
        
        if (cloudinaryRes.ok) {
          const cloudinaryData = await cloudinaryRes.json();
          uploadedUrl = cloudinaryData.secure_url;
        } else {
          console.error("Cloudinary upload failed");
        }
      }

      await createPost(token, message, uploadedUrl);
      const updatedPosts = await getPosts(token);
      setPosts(updatedPosts.posts);

      setMessage("");
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return null;
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
          padding: "20px",
          minHeight: "100vh"
        }}
      >
        <div style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 style={{ color: "#4C4C34", marginBottom: "15px", fontWeight: "bold" }}>Posts</h2>

          {/* Creation Box Wrapper */}
          <div style={{
            width: "100%",
            maxWidth: "500px",
            marginBottom: "20px"
          }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                rows="4"
                style={{
                  width: "100%",
                  minHeight: "100px",
                  resize: "vertical",
                  boxSizing: "border-box",
                  border: "1px solid #7c7267",
                  padding: "15px",
                  borderRadius: "8px",
                  fontSize: "1.05rem",
                  fontFamily: "system-ui",
                  outline: "none",
                  color: "#413933",
                  background: "#ffffff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                }}
              />

              {/* Local File Selected Image Preview Frame */}
              {imagePreview && (
                <div style={{ position: "relative", marginTop: "5px", width: "100%" }}>
                  <img 
                    src={imagePreview} 
                    alt="Selected preview" 
                    style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "6px" }} 
                  />
                  <button 
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(""); }}
                    style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: "rgba(0,0,0,0.7)", color: "#fff", border: "none",
                      borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer",
                      fontWeight: "bold", fontSize: "0.9rem"
                    }}
                  >✕</button>
                </div>
              )}

              {/* Toolbar Ribbon Controls Line Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "5px" }}>
                <label style={{
                  display: "inline-block",
                  width: "140px",
                  height: "40px",
                  lineHeight: "40px",
                  boxSizing: "border-box",
                  background: "#4C4C34", 
                  color: "#EBDED0",
                  borderRadius: "6px", 
                  cursor: "pointer", 
                  fontWeight: "bold", 
                  fontSize: "0.95rem",
                  fontFamily: "system-ui",
                  textAlign: "center",
                  border: "none"
                }}>
                  📸 Add Photo
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>

                <button
                  type="submit"
                  disabled={uploading || (!message.trim() && !imageFile)}
                  style={{
                    display: "inline-block",
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
                    opacity: (uploading || (!message.trim() && !imageFile)) ? 0.5 : 1
                  }}
                >
                  {uploading ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>

          {/* Timeline Feed Stream Container */}
          <div className="feed" role="feed" style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", width: "100%" }}>
            {posts.map((post) => (
              <Post post={post} key={post._id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}