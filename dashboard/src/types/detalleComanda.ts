export enum EstadoDetalleComanda {
  EN_PROCESO_DE_SOLICITUD = "EN_PROCESO_DE_SOLICITUD",
  ENVIADO_A_LA_COCINA = "ENVIADO_A_LA_COCINA",
  COCINERO_ASIGNADO = "COCINERO_ASIGNADO",
  ENTREGADO_PARA_DESPACHAR = "ENTREGADO_PARA_DESPACHAR",
  ENTREGADO_AL_CLIENTE = "ENTREGADO_AL_CLIENTE",
  PLAZO_EXCEDIDO_DE_ENTREGA = "PLAZO_EXCEDIDO_DE_ENTREGA",
}

export interface DetalleComanda {
  id: string;
  cantidad: number;
  estadoDetalleComanda: EstadoDetalleComanda;
  comandaId: string;
  detalleSeccionCartaId: string;
}
