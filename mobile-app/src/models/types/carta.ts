/**
 * Tipos de la carta digital, espejo de las entidades del backend
 * (ver carta-web/src/types/entities.ts — misma fuente de verdad).
 */

export interface Categoria {
  id: string;
  nombre: string;
}

export interface UnidadDeMedida {
  id: string;
  nombre: string;
}

export interface Articulo {
  id: string;
  nombre: string;
  descripcion?: string;
  sinTAC: boolean;
  esIngrediente: boolean;
  unidadDeMedida: UnidadDeMedida;
}

export interface DetalleMenu {
  id: string;
  nombre: string;
  cantidad: number;
  articulo: Articulo;
  articuloCantidad: number;
}

export interface Menu {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  detallesMenu: DetalleMenu[];
  imagenUrl?: string;
}

export interface Carta {
  id: string;
  nombre?: string;
  seccionesCarta: SeccionCarta[];
  fechaDesde: string;
  fechaHasta: string;
}

export interface SeccionCarta {
  id: string;
  nombre: string;
  categoria?: Categoria;
  imagenUrl?: string;
  detallesSeccionCarta: DetalleSeccionCartaItem[];
}

export interface DetalleSeccionCartaMenu {
  id: string;
  seccionCartaId: string;
  menu: Menu;
  imagenUrl?: string;
}

export interface DetalleSeccionCartaArticuloIndividual {
  id: string;
  seccionCartaId: string;
  precio: number;
  descripcion?: string;
  articulo: Articulo;
  imagenUrl?: string;
}

export interface Resenia {
  ambiente: number;
  servicio: number;
  comida: number;
  observacion?: string;
  comandaId: string;
}


// La API no incluye un campo discriminador: se distingue por la presencia
// de "menu" vs "articulo" en el JSON (ver isDetalleMenu/isDetalleArticulo).
export type DetalleSeccionCartaItem = DetalleSeccionCartaArticuloIndividual | DetalleSeccionCartaMenu;

export const isDetalleArticulo = (
  detalle: DetalleSeccionCartaItem,
): detalle is DetalleSeccionCartaArticuloIndividual => "articulo" in detalle;

export const isDetalleMenu = (detalle: DetalleSeccionCartaItem): detalle is DetalleSeccionCartaMenu =>
  "menu" in detalle;
