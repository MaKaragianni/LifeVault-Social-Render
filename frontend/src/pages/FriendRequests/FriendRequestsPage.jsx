import { useEffect, useState } from "react";
import {
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
} from "../../services/friendRequests";

export default function FriendRequestsPage() {
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const data = await getFriendRequests(token);
    setRequests(data);
  }

  async function accept(id) {
    await acceptFriendRequest(id, token);
    loadRequests();
  }

  async function decline(id) {
    await declineFriendRequest(id, token);
    loadRequests();
  }

  return (
    <div>
      <h2>Friend Requests</h2>

      {requests.length === 0 && (
        <p>No pending requests</p>
      )}

      {requests.map((r) => (
        <div key={r._id}>
          <p>{r.sender.username}</p>

          <button onClick={() => accept(r._id)}>
            Accept
          </button>

          <button onClick={() => decline(r._id)}>
            Decline
          </button>
        </div>
      ))}
    </div>
  );
}