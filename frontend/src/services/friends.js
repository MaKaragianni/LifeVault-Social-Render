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