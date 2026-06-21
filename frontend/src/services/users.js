const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export async function getUser(id) {
    const response = await fetch(`${BACKEND_URL}/users/${id}`);

    const data = await response.json();
    return data;
}