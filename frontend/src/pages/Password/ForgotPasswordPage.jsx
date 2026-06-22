import { useState } from "react";
import Navbar from "../../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/passwordReset/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("An error occurred. Please try again.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-content" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Forgot Password</h2>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email" 
            className="search-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', width: '280px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
            required
          />

          <button type="submit" className="btn btn-primary">
            Send Reset Link
          </button>

          {message && <p style={{ marginTop: '15px', color: '#413933' }}>{message}</p>}
        </form>
      </div>
    </>
  );
}