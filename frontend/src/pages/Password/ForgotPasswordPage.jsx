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
      <div className="page-content">
        <form 
          onSubmit={submit} 
          className="friends" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h2>Forgot Password</h2>
          
          <input 
            type="email" 
            placeholder="Email" 
            className="search-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          
          <br />
          <br />

          <button 
            type="submit"
            className="btn btn-primary"
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Send Reset Link
          </button>

          {message && <p style={{ marginTop: '15px', color: '#555' }}>{message}</p>}
        </form>
      </div>
    </>
  );
}