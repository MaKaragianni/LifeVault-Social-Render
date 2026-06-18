import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getAllFriends } from "../../services/following";
import User from "../../components/User";
import SearchBar from "../../components/SearchBar";

export function FollowingPage() {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getAllFriends(token)
        .then((data) => {
          setFriends(data.friends);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  return (
    <>
      <h2>Search Users:</h2>
      <SearchBar />
      <br></br>
      <br></br>
      <h2>Following:</h2>
      <div className="friends" role="friends">
        {friends.map((friend) => (
          <User friend={friend} key={friend._id} />
        ))}
      </div>
    </>
  );
}
