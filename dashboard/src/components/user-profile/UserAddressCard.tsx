"use client";
import React from "react";
import type { Persona } from "@/types/empleado";

interface Props {
  persona: Persona | null;
}

export default function UserAddressCard({ persona }: Props) {
  const dir = persona?.direccion;

  const field = (label: string, value: string | undefined) => (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value || "—"}</p>
    </div>
  );

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Dirección
      </h4>
      {dir ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          {field("Calle", dir.calle)}
          {field("Numeración", dir.numeracion)}
          {field("Barrio", dir.barrio)}
          {field("Observación", dir.observacion)}
          {field("Localidad", dir.localidad?.nombre)}
          {field("Departamento", dir.localidad?.departamento?.nombre)}
          {field("Provincia", dir.localidad?.departamento?.provincia?.nombre)}
          {field("País", dir.localidad?.departamento?.provincia?.pais?.nombre)}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No hay dirección registrada.
        </p>
      )}
    </div>
  );
}
