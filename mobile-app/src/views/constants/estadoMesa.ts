/**
 * Presentación de cada estado de mesa: etiqueta y colores (fondo suave + texto/punto fuerte),
 * alineados con las paletas del dashboard. Compartido por badge, tarjeta y sheet.
 */
import { Brand, Error, Gray, Success, Warning } from "@/views/constants/theme";
import type { EstadoMesa } from "@/models/types/mesa";

export interface EstadoStyle {
  label: string;
  /** Color de texto / contenido fuerte. */
  fg: string;
  /** Fondo suave del badge. */
  bg: string;
  /** Punto indicador / acento. */
  dot: string;
}

export const ESTADO_CONFIG: Record<EstadoMesa, EstadoStyle> = {
  LIBRE: { label: "Libre", fg: Success[600], bg: Success[50], dot: Success[500] },
  OCUPADA: { label: "Ocupada", fg: Brand[600], bg: Brand[50], dot: Brand[500] },
  RESERVADA: { label: "Reservada", fg: Warning[600], bg: Warning[50], dot: Warning[500] },
  FUERA_DE_SERVICIO: { label: "Fuera de servicio", fg: Gray[600], bg: Gray[100], dot: Gray[400] },
};

/** Estados que el mozo puede asignar manualmente desde la app. */
export const ESTADOS_SELECCIONABLES: EstadoMesa[] = ["LIBRE", "OCUPADA", "RESERVADA"];

/** Aviso por si el backend devolviera un estado desconocido. */
export const ESTADO_FALLBACK: EstadoStyle = ESTADO_CONFIG.FUERA_DE_SERVICIO;

export function estadoStyle(estado: EstadoMesa): EstadoStyle {
  return ESTADO_CONFIG[estado] ?? ESTADO_FALLBACK;
}

/**
 * Mesas que requieren la atención del mozo: las reservadas, porque hay que
 * prepararlas antes de que lleguen los comensales.
 */
export function requiereAtencion(estado: EstadoMesa): boolean {
  return estado === "RESERVADA";
}
