"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

interface AuthContextType {
  token: string | null;
  login: (email: string, clave: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = document.cookie
      .split("; ")
      .find((r) => r.startsWith("auth-token="))
      ?.split("=")[1];
    if (stored) setToken(stored);
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
    router.push("/");
  }

  function logout(): void {
    document.cookie = "auth-token=; path=/; max-age=0";
    setToken(null);
    router.push("/signin");
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
