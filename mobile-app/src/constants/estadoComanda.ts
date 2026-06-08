/**
 * Presentación del estado de cada línea de pedido (DetalleComanda): etiqueta y
 * colores, alineados con las paletas del dashboard. Compartido por la tarjeta
 * de comanda y el filtro.
 *
 * El prototipo de "Comandas" muestra los chips "Asignado" y "En Cocina": los
 * mapeamos a los valores más cercanos de EstadoDetalleComanda (COCINERO_ASIGNADO
 * y ENVIADO_A_LA_COCINA) — la app del mozo solo filtra por esos dos, que son los
 * que le interesa seguir mientras la cocina prepara el pedido.
 */
import { Brand, Gray, Success, Warning } from "@/constants/theme";
import type { EstadoDetalleComanda } from "@/types/comanda";

export interface EstadoDetalleStyle {
  label: string;
  /** Color de texto / contenido fuerte. */
  fg: string;
  /** Fondo suave del badge. */
  bg: string;
  /** Punto indicador / acento. */
  dot: string;
}

export const ESTADO_DETALLE_CONFIG: Record<EstadoDetalleComanda, EstadoDetalleStyle> = {
  EN_PROCESO_DE_SOLICITUD: { label: "En solicitud", fg: Gray[600], bg: Gray[100], dot: Gray[400] },
  ENVIADO_A_LA_COCINA: { label: "En cocina", fg: Warning[600], bg: Warning[50], dot: Warning[500] },
  COCINERO_ASIGNADO: { label: "Asignado", fg: Brand[600], bg: Brand[50], dot: Brand[500] },
  ENTREGADO_PARA_DESPACHAR: { label: "Para despachar", fg: Success[600], bg: Success[50], dot: Success[500] },
  ENTREGADO_AL_CLIENTE: { label: "Entregado", fg: Success[600], bg: Success[50], dot: Success[500] },
  PLAZO_EXCEDIDO_DE_ENTREGA: { label: "Plazo excedido", fg: Gray[600], bg: Gray[100], dot: Gray[400] },
};

/** Aviso por si el backend devolviera un estado desconocido. */
export const ESTADO_DETALLE_FALLBACK: EstadoDetalleStyle = ESTADO_DETALLE_CONFIG.EN_PROCESO_DE_SOLICITUD;

export function estadoDetalleStyle(estado: EstadoDetalleComanda): EstadoDetalleStyle {
  return ESTADO_DETALLE_CONFIG[estado] ?? ESTADO_DETALLE_FALLBACK;
}

/** Estados de detalle que el filtro de "Comandas" ofrece, además de "Todas". */
export const ESTADOS_DETALLE_FILTRABLES: EstadoDetalleComanda[] = ["COCINERO_ASIGNADO", "ENVIADO_A_LA_COCINA"];

/**
 * Estado "representativo" de una comanda para mostrar en su tarjeta: el más
 * avanzado entre los de sus líneas de pedido (mismo orden que el enum del
 * backend). Si no tiene detalles, no hay nada que mostrar.
 */
const ORDEN_AVANCE: EstadoDetalleComanda[] = [
  "EN_PROCESO_DE_SOLICITUD",
  "ENVIADO_A_LA_COCINA",
  "COCINERO_ASIGNADO",
  "ENTREGADO_PARA_DESPACHAR",
  "ENTREGADO_AL_CLIENTE",
  "PLAZO_EXCEDIDO_DE_ENTREGA",
];

export function estadoDetalleMasAvanzado(estados: EstadoDetalleComanda[]): EstadoDetalleComanda | null {
  if (estados.length === 0) return null;
  return estados.reduce((mejor, actual) =>
    ORDEN_AVANCE.indexOf(actual) > ORDEN_AVANCE.indexOf(mejor) ? actual : mejor,
  );
}
