"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { profileService } from "@/services/profileService";
import type { Usuario } from "@/types/usuario";
import type { Persona } from "@/types/empleado";
import UserMetaCard from "./UserMetaCard";
import UserInfoCard from "./UserInfoCard";
import UserAddressCard from "./UserAddressCard";

export default function ProfileContent() {
  const { user: authUser } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser?.id) return;

    async function load() {
      try {
        const u = await profileService.getUsuario(authUser!.id);
        setUsuario(u);
        if (u.personaId) {
          const p = await profileService.getPersona(u.personaId);
          setPersona(p);
        }
      } catch {
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authUser?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        Cargando perfil...
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="flex items-center justify-center py-20 text-error-500">
        {error ?? "Error al cargar el perfil."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserMetaCard usuario={usuario} persona={persona} />
      <UserInfoCard
        usuario={usuario}
        persona={persona}
        onPersonaUpdated={setPersona}
      />
      <UserAddressCard persona={persona} />
    </div>
  );
}
