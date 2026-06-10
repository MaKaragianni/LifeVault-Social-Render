import { useNavigate } from "react-router-dom";

function Post(props) {
  const navigate = useNavigate();

  return (
    <article style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
      <div
        onClick={() => props.post.user && navigate(`/profile/${props.post.user._id}`)}
        style={{ cursor: props.post.user ? "pointer" : "default", fontWeight: "bold" }}
      >
        {props.post.user ? props.post.user.username : "Anonymous User"}
      </div>
      
      <p>{props.post.message}</p>
    </article>
  );
}

export default Post;
