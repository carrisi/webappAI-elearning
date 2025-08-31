import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Style/Register.css";

/**
 * Registrazione utente (frontend-only).
 * - Ruolo: "student" | "teacher"
 * - Campi: nome, cognome, email, password, conferma password
 *
 * TODO (Firebase, step successivo):
 *  - createUserWithEmailAndPassword(auth, email, password)
 *  - setDoc(doc(db, "users", uid), { role, name, surname, ... })
 */
export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Inserisci il nome.";
    if (!form.surname.trim()) e.surname = "Inserisci il cognome.";
    if (!form.email.trim()) e.email = "Inserisci l’email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email non valida.";

    if (!form.password) e.password = "Inserisci la password.";
    else if (form.password.length < 8) e.password = "Minimo 8 caratteri.";
    else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = "Serve almeno 1 maiuscola e 1 numero.";

    if (!form.confirm) e.confirm = "Conferma la password.";
    else if (form.confirm !== form.password) e.confirm = "Le password non coincidono.";

    if (!form.terms) e.terms = "Devi accettare i termini.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // MOCK: simula creazione e torna al login con banner
      await new Promise((r) => setTimeout(r, 700));
      navigate("/login", { state: { justRegistered: true, email: form.email } });
    } catch (err) {
      setErrors({ general: "Impossibile completare la registrazione. Riprova." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-v2">
      <div className="register-card glass">
        {/* Header/brand breve per coerenza con Login */}
        <header className="reg-header">
          <div className="logo">AI</div>
          <div>
            <h1>Crea il tuo account</h1>
            <p>Iscriviti come Studente o Docente e inizia subito.</p>
          </div>
        </header>

        {/* Segmented switch ruolo (stesso pattern di Login) */}
        <div className="segmented" role="tablist" aria-label="Seleziona ruolo">
          <button
            type="button"
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
            aria-selected={role === "student"}
          >
            Studente
          </button>
          <button
            type="button"
            className={role === "teacher" ? "active" : ""}
            onClick={() => setRole("teacher")}
            aria-selected={role === "teacher"}
          >
            Docente
          </button>
        </div>

        {/* Form */}
        <form className="reg-form" onSubmit={handleSubmit} noValidate>
          {errors.general && <div className="alert">{errors.general}</div>}

          <div className="grid-2">
            <label className="field">
              <span>Nome</span>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Es. Mario"
                value={form.name}
                onChange={onChange}
                autoComplete="given-name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>

            <label className="field">
              <span>Cognome</span>
              <input
                id="surname"
                name="surname"
                type="text"
                placeholder="Es. Rossi"
                value={form.surname}
                onChange={onChange}
                autoComplete="family-name"
              />
              {errors.surname && <span className="field-error">{errors.surname}</span>}
            </label>
          </div>

          <label className="field">
            <span>Email istituzionale</span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nome.cognome@esempio.it"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <div className="grid-2">
            <label className="field">
              <span>Password</span>
              <div className="pwd-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Min 8 caratteri, 1 maiuscola e 1 numero"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="new-password"
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
              {errors.password && <span className="field-error">{errors.password}</span>}
            </label>

            <label className="field">
              <span>Conferma password</span>
              <input
                id="confirm"
                name="confirm"
                type={showPwd ? "text" : "password"}
                placeholder="Ripeti la password"
                value={form.confirm}
                onChange={onChange}
                autoComplete="new-password"
              />
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </label>
          </div>

          <label className="check terms">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={onChange}
            />
            <span>Accetto i Termini e l’Informativa Privacy</span>
          </label>
          {errors.terms && <span className="field-error">{errors.terms}</span>}

          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? "Creazione in corso..." : "Crea account"}
          </button>

          <p className="footer">
            Hai già un account? <Link to="/login">Accedi</Link>
          </p>

          <input type="hidden" name="role" value={role} />
        </form>
      </div>
    </div>
  );
}
