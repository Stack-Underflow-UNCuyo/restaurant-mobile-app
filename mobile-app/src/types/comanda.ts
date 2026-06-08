/**
 * Tipos de comanda, espejo de ComandaRestaurantDto / DetalleComandaDto del backend.
 * Solo se incluyen los campos que la app del mozo necesita mostrar — igual que
 * con Empresa, dejamos afuera relaciones que no se usan en pantalla (cliente,
 * empleado, reserva).
 */
export type EstadoComanda =
  | "ABIERTA"
  | "FINALIZADA"
  | "ANULADA"
  | "PENDIENTE_DE_ENTREGA"
  | "ENTREGA_FALLIDA";

export type EstadoDetalleComanda =
  | "EN_PROCESO_DE_SOLICITUD"
  | "ENVIADO_A_LA_COCINA"
  | "COCINERO_ASIGNADO"
  | "ENTREGADO_PARA_DESPACHAR"
  | "ENTREGADO_AL_CLIENTE"
  | "PLAZO_EXCEDIDO_DE_ENTREGA";

export interface Comanda {
  id: string;
  fechaSolicitudComanda: string;
  fechaEntregaComanda: string | null;
  estadoComanda: EstadoComanda;
  mesaRestauranteId: string | null;
}

export interface DetalleComanda {
  id: string;
  cantidad: number;
  estadoDetalleComanda: EstadoDetalleComanda;
  comandaId: string;
  detalleSeccionCartaId: string;
  /** Nombre del artículo o menú pedido (resuelto por el backend). */
  nombre: string | null;
  /** Precio unitario del artículo o menú pedido. */
  precio: number;
}
