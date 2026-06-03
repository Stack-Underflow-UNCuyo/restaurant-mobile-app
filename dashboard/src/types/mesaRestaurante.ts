export enum EstadoMesa {
  LIBRE = "LIBRE",
  RESERVADA = "RESERVADA",
  OCUPADA = "OCUPADA",
  FUERA_DE_SERVICIO = "FUERA_DE_SERVICIO",
}

export interface MesaRestaurante {
  id: string;
  identificadorMesa: number;
  estadoMesa: EstadoMesa;
  capacidadPersonas: number;
  zonaFisica: string;
}
