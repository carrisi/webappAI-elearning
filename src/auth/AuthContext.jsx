// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);             // es: { email, role: "student" | "teacher" }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth:user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async ({ email, password, role }) => {
    // Qui puoi integrare API reali (Firebase, backend). Per ora mock:
    if (!email || !password) throw new Error("Email e password sono obbligatorie.");
    if (!["student", "teacher"].includes(role)) throw new Error("Seleziona un ruolo.");
    const u = { email, role };
    localStorage.setItem("auth:user", JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem("auth:user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
