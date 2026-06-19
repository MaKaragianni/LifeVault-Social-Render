import { useNavigate } from "react-router-dom";

function User(props) {
  const navigate = useNavigate();

  return (
    <article
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px",
        width: "200px",
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0.08)"
      }}
    >
      <div
        onClick={() => props.friend && navigate(`/profile/${props.friend._id}`)}
        style={{
          cursor: props.friend ? "pointer" : "default",
          fontWeight: "bold",
          display: "flex",
          alignItems: "centre",
          gap: "10px",
        }}
      >
        <img
          src={props.friend.profilePic}
          alt="profilePic"
          width="40"
          height="40"
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <strong>
          {props.friend ? props.friend.username : "Anonymous User"}
        </strong>
      </div>
    </article>
  );
}

export default User;
