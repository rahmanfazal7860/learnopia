import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("learnopia_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("learnopia_user");
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("learnopia_token", newToken);
    localStorage.setItem("learnopia_user", JSON.stringify(newUser));
  };

  const login = useCallback(async (email, password) => {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: { name, email, password, role },
    });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("learnopia_token");
    localStorage.removeItem("learnopia_user");
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
