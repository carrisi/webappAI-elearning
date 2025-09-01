import { createContext, useContext, useEffect, useState } from "react";
import { observeAuth, logout } from "../services/auth";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, profile: null, loading: true });

  useEffect(() => {
    const unsub = observeAuth(({ user, profile }) => {
      setState({ user, profile, loading: false });
    });
    return () => unsub();
  }, []);

  const value = {
    ...state,
    isTeacher: state.profile?.role === "teacher",
    isStudent: state.profile?.role === "student",
    logout,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
