import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // step 1 = request token, step 2 = submit new password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // ── Step 1: request a reset token
  async function handleRequestToken(e) {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(`${API_URL}/passwordReset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage(
          "Token generated. Check the server console, copy the token, then complete step 2 below."
        );
        setStep(2);
      } else {
        setIsError(true);
        setMessage("Could not request a reset token. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("An unexpected error occurred. Please try again.");
    }
  }

  // ── Step 2: submit token + new password
  async function handleResetPassword(e) {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/passwordReset/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: newPassword,
          confirmPassword: confirmPassword
         }),
      });

      if (response.ok) {
        alert("Password updated successfully! Please log in with your new password.");
        navigate("/login");
      } else {
        const data = await response.json().catch(() => ({}));
        setIsError(true);
        setMessage(data.message || "Invalid or expired token. Please start again.");
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("An unexpected error occurred. Please try again.");
    }
  }

  const inputStyle = {
    padding: "10px",
    width: "280px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const btnStyle = {
    padding: "10px 24px",
    background: "#4C4C34",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <>
      <Navbar />
      <div
        className="page-content"
        style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", paddingTop: "40px" }}
      >
        <h2>Reset Password</h2>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <form
            onSubmit={handleRequestToken}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", marginTop: "20px" }}
          >
            <p style={{ color: "#60554c", marginBottom: "4px" }}>
              Enter your registered email to receive a reset token.
            </p>
            <input
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={btnStyle}>
              Send Reset Token
            </button>

            {message && (
              <p style={{ color: isError ? "#d32f2f" : "#2e7d32", fontWeight: "bold" }}>
                {message}
              </p>
            )}
          </form>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <form
            onSubmit={handleResetPassword}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", marginTop: "20px" }}
          >
            {message && (
              <p style={{ color: isError ? "#d32f2f" : "#2e7d32", fontWeight: "bold" }}>
                {message}
              </p>
            )}

            <input
              type="text"
              placeholder="Paste reset token here"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={btnStyle}>
              Change Password
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setMessage(""); setIsError(false); }}
              style={{ background: "none", border: "none", color: "#8c7c70", cursor: "pointer", textDecoration: "underline" }}
            >
              ← Start over
            </button>

            {message && isError && (
              <p style={{ color: "#d32f2f", fontWeight: "bold" }}>{message}</p>
            )}
          </form>
        )}
      </div>
    </>
  );
}