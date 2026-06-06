/**
 * Estado de autenticación global. Persiste el JWT de forma segura y expone
 * el usuario actual (con su tipoEmpleado) a toda la app.
 *
 * Uso: const { user, token, login, logout } = useAuth();
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { clearToken, getToken, saveToken } from "@/lib/tokenStorage";
import * as authService from "@/services/authService";
import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  /** true mientras se restaura la sesión guardada al iniciar la app. */
  loading: boolean;
  login: (email: string, clave: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión guardada al arrancar.
  useEffect(() => {
    (async () => {
      try {
        const stored = await getToken();
        if (stored && !authService.isTokenExpired(stored)) {
          const restored = await authService.resolveAuthUser(stored);
          setToken(stored);
          setUser(restored);
        } else if (stored) {
          await clearToken();
        }
      } catch {
        // token inválido o backend caído: arrancamos deslogueados.
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, clave: string) => {
    const { token: newToken, user: newUser } = await authService.login(email, clave);
    await saveToken(newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
