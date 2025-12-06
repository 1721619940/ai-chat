import { useState } from "react";
import api from "../api";

export default function Login({ onSuccess, goSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="page-container">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-text">{error}</p>}
          <button className="btn primary" type="submit">
            Login
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account?{" "}
          <button className="link-btn" type="button" onClick={goSignup}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
