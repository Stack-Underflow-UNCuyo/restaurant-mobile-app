/**
 * Tipos de mesa, espejo de MesaRestauranteDto del backend.
 * EstadoMesa incluye los 4 valores del backend aunque la app del mozo solo
 * ofrezca 3 como seleccionables (ver ESTADOS_SELECCIONABLES en constants/estadoMesa).
 */
export type EstadoMesa = "LIBRE" | "RESERVADA" | "OCUPADA" | "FUERA_DE_SERVICIO";

export interface Mesa {
  id: string;
  identificadorMesa: number;
  estadoMesa: EstadoMesa;
  capacidadPersonas: number;
  zonaFisica: string;
}
