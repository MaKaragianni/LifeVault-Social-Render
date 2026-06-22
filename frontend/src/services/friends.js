const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export async function getFriends(token) {
  const response = await fetch(
    `${BACKEND_URL}/friends`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load friends");
  }

  return response.json();
}

export async function searchUsers(token, query) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Adjust backend query structure if your backend search endpoint expects something else
  const response = await fetch(
    `${BACKEND_URL}/users/search?q=${encodeURIComponent(query)}`, 
    requestOptions
  );

  if (!response.ok) {
    throw new Error("Unable to search users");
  }

  const data = await response.json();
  return data;
}