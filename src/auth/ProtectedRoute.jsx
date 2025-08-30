// src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Uso:
 * <Route element={<ProtectedRoute requiredRole="student" />}>
 *   <Route path="/student/*" element={<StudentApp />} />
 * </Route>
 */
export default function ProtectedRoute({ requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return null; // o uno spinner
  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    // se loggato con ruolo diverso, redireziona alla sua home
    return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
  }

  return <Outlet />;
}
