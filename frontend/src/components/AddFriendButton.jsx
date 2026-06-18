import { handleFollow } from "../services/friends";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getAllFriends } from "../services/friends";

function AddFriendButton() {
  const { id } = useParams();
  const [text, setText] = useState("follow");

  const token = localStorage.getItem("token");
  
  async function isFollowing() {
    const friendsList = await getAllFriends(token);
    const friend = friendsList.friends.find(friend =>
      friend._id === id
    );
    if (friend === undefined) setText("+ Follow");
    else setText("- Unfollow");
    console.log(friend);
  }
  isFollowing();

  async function handleButton() {
    const response = await handleFollow(token, id);

    if (response.message === "Followed") setText("- Unfollow");
    else setText("+ Follow");
  }

  return (
    <button
      className="add-friend"
      type="submit"
      onClick={handleButton}
      style={{
        padding: "8px 16px",
        background: "#4C4C34",
        color: "#EBDED0",
        fontFamily: "system-ui",
        fontSize: "1rem",
      }}
    >
      {text}
    </button>
  );
}

export default AddFriendButton;
