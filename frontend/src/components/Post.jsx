import { useNavigate } from "react-router-dom";

function Post({ post }) {
  const navigate = useNavigate();

  return (
    <article
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px"
      }}
    >
      <div
        onClick={() => navigate(`/profile/${post.user._id}`)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src={post.user.profilePic}
          alt=""
          width="40"
          height="40"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      
        <strong>{post.user.username}</strong>
      </div>
      
      <p>{post.message}</p>
      
      {post.image && (
        <img
          src={post.image}
          alt="post"
          width="300"
        />
      )}
    </article>
  );
}

export default Post;
