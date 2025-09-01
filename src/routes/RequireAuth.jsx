import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return null; // qui puoi mostrare uno spinner
  return user ? <Outlet/> : <Navigate to="/login" replace />;
}
