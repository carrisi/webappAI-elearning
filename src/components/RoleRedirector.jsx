import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirector() {
  const { user, profile, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { nav("/login", { replace: true }); return; }
    if (profile?.role === "teacher") nav("/docente", { replace: true });
    else if (profile?.role === "student") nav("/studente", { replace: true });
  }, [user, profile, loading, nav]);

  return null; // o uno spinner
}
