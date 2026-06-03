export enum EstadoComanda {
  ABIERTA = "ABIERTA",
  FINALIZADA = "FINALIZADA",
  ANULADA = "ANULADA",
  PENDIENTE_DE_ENTREGA = "PENDIENTE_DE_ENTREGA",
  ENTREGA_FALLIDA = "ENTREGA_FALLIDA",
}

export interface ComandaDto {
  id: string;
  fechaSolicitudComanda: string | null;
  fechaEntregaComanda: string | null;
  estadoComanda: EstadoComanda;
  clienteId: string;
  reservaMesaId: string;
}

export interface ComandaRestaurantDto extends ComandaDto {
  empleado: EmpleadoRef | null;
}

export interface EmpleadoRef {
  id: string;
  nombre: string;
  apellido: string;
}

export interface ClienteRef {
  id: string;
  nombre: string;
  apellido: string;
}
