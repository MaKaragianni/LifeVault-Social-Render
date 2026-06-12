const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createPost(token, message) {
  const response = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
        Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}
