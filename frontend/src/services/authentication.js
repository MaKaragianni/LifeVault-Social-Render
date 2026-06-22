// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export async function login(email, password) {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    let data = await response.json();
    return data;
  } else {
    throw new Error(
      `Received status ${response.status} when logging in. Expected 201`
    );
  }
}

export async function signup(email, password, confirmPassword, username, profilePicFile, bio, dateOfBirth) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("confirmPassword", confirmPassword);
  formData.append("username", username);
  formData.append("bio", bio);
  formData.append("dateOfBirth", dateOfBirth || "2000-01-01"); // Safe default if left blank

  if (profilePicFile) {
    formData.append("profilePic", profilePicFile);
  }

  const response = await fetch(`${BACKEND_URL}/users`, {
    method: "POST",
    body: formData, // No application/json headers needed; FormData sets boundaries natively
  });

  if (response.status === 201) {
    return;
  } else {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Received status ${response.status} when signing up. Expected 201`
    );
  }
}