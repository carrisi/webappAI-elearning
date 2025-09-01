// TEST FIREBASE PER FIREBASE
// import { auth, db } from "../firebase";
// console.log("Auth OK:", !!auth, "DB OK:", !!db);

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Style/Login.css";

// 🔗 servizi Firebase
import { login } from "../services/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// Mappatura delle route in base al ruolo salvato in Firestore
const PATH_BY_ROLE = {
  student: "/studente",
  teacher: "/docente",
};

// Valori dell'interruttore UI (solo estetica)
const ROLES_UI = ["studente", "docente"];

export default function Login() {
  const [roleUi, setRoleUi] = useState(ROLES_UI[0]); // solo per UI
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("login.roleUi");
    if (saved && ROLES_UI.includes(saved)) setRoleUi(saved);
  }, []);

  const onRole = (r) => {
    setRoleUi(r);
    localStorage.setItem("login.roleUi", r);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // 1) Login Firebase Auth
      const { user } = await login(email, password);

      // 2) Leggi profilo/ruolo da Firestore
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const profile = snap.exists() ? snap.data() : null;

      // 3) Decidi rotta: prima in base al profilo, fallback all'UI se assente
      const path =
        PATH_BY_ROLE[profile?.role] ??
        (roleUi === "docente" ? PATH_BY_ROLE.teacher : PATH_BY_ROLE.student);

      nav(path, { replace: true });
    } catch (err) {
      // Messaggi più utili
      let msg = "Email o password non validi.";
      if (err?.code === "auth/too-many-requests") msg = "Troppi tentativi. Riprova più tardi.";
      if (err?.code === "auth/user-disabled") msg = "Utente disabilitato.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const justRegistered = location.state?.justRegistered;
  const registeredEmail = location.state?.email;

  return (
    <div className="login-v2">
      <div className="login-card glass">
        {/* Header sinistro con logo/claim */}
        <aside className="panel">
          <div className="brand">
            <div className="logo">AI</div>
            <h1>AI Learning</h1>
            <p>Una piattaforma e-learning intelligente, con chat AI sui contenuti caricati.</p>
          </div>
          <ul className="bullets">
            <li>Accesso rapido per Studenti e Docenti</li>
            <li>UI in glassmorphism, responsive</li>
            <li>Integrazione Firebase attiva</li>
          </ul>
        </aside>

        {/* Form di login */}
        <section className="form">
          <h2>Accedi al tuo spazio</h2>

          {justRegistered && (
            <p className="success">
              Account creato per <strong>{registeredEmail}</strong>. Ora effettua l’accesso.
            </p>
          )}

          <div className="segmented" role="tablist" aria-label="Seleziona ruolo (solo UI)">
            <button
              type="button"
              className={roleUi === "studente" ? "active" : ""}
              onClick={() => onRole("studente")}
              aria-selected={roleUi === "studente"}
            >
              Studente
            </button>
            <button
              type="button"
              className={roleUi === "docente" ? "active" : ""}
              onClick={() => onRole("docente")}
              aria-selected={roleUi === "docente"}
            >
              Docente
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label className="field">
              <span>Email istituzionale</span>
              <input
                type="email"
                placeholder="nome.cognome@esempio.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <div className="pwd-wrap">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="La tua password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? "Nascondi password" : "Mostra password"}
                >
                  {showPwd ? "Nascondi" : "Mostra"}
                </button>
              </div>
            </label>

            {error && <p className="error">{error}</p>}

            <div className="row small">
              <label className="check">
                <input type="checkbox" /> Remember
              </label>
              {/* TODO: collega alla funzione reset password quando la aggiungiamo */}
              <a className="link" href="#">Forgot password?</a>
            </div>

            <button className="primary" type="submit" disabled={submitting}>
              {submitting ? "Accesso in corso..." : "Login"}
            </button>
          </form>

          <p className="footer">
            Non hai un account? <Link to="/register">Crea un account</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
