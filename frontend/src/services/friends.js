// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getAllFriends(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/friends`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch friends");
  }

  const data = await response.json();
  return data;
}

export async function searchUsers(token, searchQuery) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${BACKEND_URL}/users/search?username=${searchQuery}`,
    requestOptions,
  );

  if (response.status !== 200) {
    throw new Error("Unable to fetch user");
  }

  const data = await response.json();
  return data;
}

export async function addFriend(token, friendId) {
  const requestOptions = {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  };

  const response = await fetch(
    `${BACKEND_URL}/users/${friendId}/friends`,
    requestOptions,
  );

  if (response.status !== 200) {
    console.error("Something went wrong")
  }

  const data = await response.json();
  return data;
}