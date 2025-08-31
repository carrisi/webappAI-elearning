import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './Style/Login.css'

// === MOCK MODE: metti a false quando colleghi Firebase ===
const MOCK_MODE = true;

const ROLES = ["studente", "docente"];

export default function Login() {
  const [role, setRole] = useState(ROLES[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("login.role");
    if (saved && ROLES.includes(saved)) setRole(saved);
  }, []);

  const onRole = (r) => {
    setRole(r);
    localStorage.setItem("login.role", r);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const go = role === "studente" ? "/studente" : "/docente";

    try {
      if (MOCK_MODE) {
        await new Promise((r) => setTimeout(r, 300));
        nav(go);
        return;
      }
      // TODO: Firebase:
      // const cred = await signInWithEmailAndPassword(auth, email, password);
      // await setDoc(doc(db, "users", cred.user.uid), { role }, { merge: true });
      // nav(go);
    } catch (err) {
      setError("Email o password non validi.");
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
            <li>Pronta per integrazione Firebase</li>
          </ul>
        </aside>

        {/* Form di login */}
        <section className="form">
          <h2>Accedi al tuo spazio</h2>

          {MOCK_MODE && (
            <p className="hint">Modalità demo: il login reindirizza in base al ruolo.</p>
          )}

          {justRegistered && (
            <p className="success">
              Account creato per <strong>{registeredEmail}</strong>. Ora effettua l’accesso.
            </p>
          )}

          <div className="segmented" role="tablist" aria-label="Seleziona ruolo">
            <button
              type="button"
              className={role === "studente" ? "active" : ""}
              onClick={() => onRole("studente")}
              aria-selected={role === "studente"}
            >
              Studente
            </button>
            <button
              type="button"
              className={role === "docente" ? "active" : ""}
              onClick={() => onRole("docente")}
              aria-selected={role === "docente"}
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
              <a className="link" href="#">Forgot password?</a>
            </div>

            <button className="primary" type="submit">Login</button>
          </form>

          <p className="footer">
            Non hai un account? <Link to="/register">Crea un account</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
