import { handleFollow } from "../services/following";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllFriends } from "../services/following";

function FollowButton() {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getIsFollowing();
  }, []);

  async function getIsFollowing() {
    const friendsList = await getAllFriends(token);
    const friend = friendsList.friends.find((friend) => friend._id === id);
    if (friend === undefined) setIsFollowing(false);
    else setIsFollowing(true);
  }

  async function toggleFollowing() {
    try {
      await handleFollow(token, id);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <button
      className="add-friend"
      type="submit"
      onClick={toggleFollowing}
      style={{
        padding: "8px 16px",
        background: "#4C4C34",
        color: "#EBDED0",
        fontFamily: "system-ui",
        fontSize: "1rem",
        borderRadius: "6px",
      }}
    >
      {isFollowing ? "- Unfollow" : "+ Follow"}
    </button>
  );
}

export default FollowButton;
