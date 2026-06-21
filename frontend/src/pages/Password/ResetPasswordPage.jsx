import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();

    const res = await fetch(
      `${API_URL}/passwordReset/reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <form onSubmit={submit}>
      <h2>Reset Password</h2>

      <input
        placeholder="Token"
        value={token}
        onChange={(e) =>
          setToken(e.target.value)
        }
      />

      <input
        placeholder="New Password"
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button>Reset Password</button>

      <p>{message}</p>
    </form>
  );
}