import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ role }) {
  const { profile, loading } = useAuth();
  if (loading) return null;
  return profile?.role === role ? <Outlet/> : <Navigate to="/" replace />;
}
