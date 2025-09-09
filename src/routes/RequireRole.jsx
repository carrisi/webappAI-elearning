// src/routes/RequireRole.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ role }) {
  const { user, profile, loading } = useAuth();

  // 1) Finché onAuthStateChanged non ha finito → attendi
  if (loading) return null; // qui puoi mostrare uno spinner

  // 2) Se non c'è utente → vai al login
  if (!user) return <Navigate to="/login" replace />;

  // 3) Utente presente ma profilo non ancora caricato → attendi
  if (!profile) return null; // o uno spinner leggero

  // 4) Profilo caricato → controlla il ruolo
  return profile.role === role ? <Outlet /> : <Navigate to="/" replace />;
}
