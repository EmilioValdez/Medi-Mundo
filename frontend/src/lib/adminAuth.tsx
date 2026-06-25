"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const API = "/api";

interface User { id: number; username: string; email?: string; role?: string; }
interface AuthCtx {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (t: string) => {
    try {
      const res = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${t}` } });
      if (!res.ok) throw new Error();
      setUser(await res.json());
    } catch {
      localStorage.removeItem("medimundo_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem("medimundo_token");
    if (t) { setToken(t); fetchUser(t); }
    else setLoading(false);
  }, [fetchUser]);

  const login = async (username: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      let detail = "Credenciales incorrectas";
      try { detail = (await res.json()).detail || detail; } catch { /* non-JSON error body */ }
      throw new Error(detail);
    }
    const { access_token } = await res.json();
    localStorage.setItem("medimundo_token", access_token);
    setToken(access_token);
    const me = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${access_token}` } });
    setUser(await me.json());
  };

  const logout = () => {
    localStorage.removeItem("medimundo_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!token && !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("medimundo_token");
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };
  if (!isFormData) headers["Content-Type"] = "application/json";
  return fetch(`${API}${path}`, { ...options, headers });
}
