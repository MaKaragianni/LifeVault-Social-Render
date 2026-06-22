const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export async function createPost(token, message, imageUrl = "") {
  const response = await fetch(`${BACKEND_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      message: message, 
      image: imageUrl 
    }),
  });

  const data = await response.json();

  if (response.status !== 201) {
    throw new Error(data.message || "Failed to create post");
  }

  return data;
}