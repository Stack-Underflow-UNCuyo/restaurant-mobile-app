"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

export interface AuthUser {
  id: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, clave: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id:    payload.sub  ?? "",
      email: payload.e    ?? "",
      roles: payload.a    ?? [],
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser]   = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = document.cookie
      .split("; ")
      .find((r) => r.startsWith("auth-token="))
      ?.split("=")[1];
    if (stored) {
      setToken(stored);
      setUser(decodeToken(stored));
    }
  }, []);

  async function login(email: string, clave: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, clave }),
    });
    if (!res.ok) throw new Error("Credenciales incorrectas");
    const { accessToken } = (await res.json()) as { accessToken: string };
    document.cookie = `auth-token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
    setToken(accessToken);
    setUser(decodeToken(accessToken));
    router.push("/");
  }

  function logout(): void {
    document.cookie = "auth-token=; path=/; max-age=0";
    setToken(null);
    setUser(null);
    router.push("/signin");
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
