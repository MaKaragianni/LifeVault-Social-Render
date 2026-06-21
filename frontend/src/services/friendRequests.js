const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// SEND FRIEND REQUEST
export async function sendFriendRequest(userId, token) {
  const res = await fetch(
    `${API_URL}/friendRequests/request/${userId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

// GET PENDING REQUESTS
export async function getFriendRequests(token) {
  const res = await fetch(
    `${API_URL}/friendRequests/requests`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

// ACCEPT REQUEST
export async function acceptFriendRequest(
  requestId,
  token
) {
  const res = await fetch(
    `${API_URL}/friendRequests/accept/${requestId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

// DECLINE REQUEST
export async function declineFriendRequest(
  requestId,
  token
) {
  const res = await fetch(
    `${API_URL}/friendRequests/decline/${requestId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

// REMOVE FRIEND
export async function removeFriend(userId, token) {
  const res = await fetch(
    `${API_URL}/friendRequests/remove/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}