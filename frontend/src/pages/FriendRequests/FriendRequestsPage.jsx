import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

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
    try {
      const data = await getFriendRequests(token);
      // Ensure we extract the array, defaulting to an empty array as a safety net
      setRequests(data.requests || []); 
    } catch (error) {
      console.error("Failed to load friend requests:", error);
    }
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
    <>
      <Navbar />
      <div className="page-content">
        <div>
          <h2>Friend Requests</h2>

          {requests.length === 0 && (
            <p>No pending requests</p>
          )}

          {requests.map((r) => (
            <div key={r._id} style={{ margin: '10px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <p style={{ margin: 0 }}>{r.sender.username}</p>

              <button className="btn btn-primary" onClick={() => accept(r._id)}>
                Accept
              </button>

              <button className="btn btn-secondary" onClick={() => decline(r._id)}>
                Decline
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}