// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Style/Login.css";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null); // "student" | "teacher"
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const u = await login({ email, password, role });
      if (u.role === "student") nav("/studente", { replace: true });
      else nav("/docente", { replace: true });
    } catch (err) {
      setError(err.message || "Errore di accesso");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Accedi</h1>

        <div className="role-switch">
          <button
            type="button"
            className={`role-btn ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
            aria-pressed={role === "student"}
          >
            Studente
          </button>
          <button
            type="button"
            className={`role-btn ${role === "teacher" ? "active" : ""}`}
            onClick={() => setRole("teacher")}
            aria-pressed={role === "teacher"}
          >
            Docente
          </button>
        </div>

        <label className="login-label">
          Email
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="es. nome@uniba.it"
            required
          />
        </label>

        <label className="login-label">
          Password
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error && <div className="login-error">{error}</div>}

        <button className="login-submit" type="submit" disabled={!role}>
          Accedi come {role === "teacher" ? "Docente" : role === "student" ? "Studente" : "…"}
        </button>

        <p className="login-hint">Seleziona prima il ruolo.</p>
      </form>
    </div>
  );
}
