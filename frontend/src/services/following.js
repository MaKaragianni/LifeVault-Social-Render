// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getAllFriends(token) {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`${BACKEND_URL}/friends`, requestOptions);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch following data");
  }
}

export async function searchUsers(token, searchQuery) {
  try {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch user");
  }
}

export async function handleFollow(token, friendId) {
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      `${BACKEND_URL}/users/${friendId}/handlefollow`,
      requestOptions,
    );

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}
