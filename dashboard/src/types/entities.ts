
export interface Pais {
  id: string;
  nombre: string;
}

export interface Provincia {
  id: string;
  nombre: string;
  pais: Pais;
}

export interface Departamento {
  id: string;
  nombre: string;
  provincia: Provincia;
}

export interface Localidad {
  id: string;
  nombre: string;
  codigoPostal: string;
  departamento: Departamento;
}

export interface Direccion {
  id: string;
  calle: string;
  numeracion: string;
  barrio: string;
  observacion?: string;
  localidad: Localidad;
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

export interface Stock {
  id: string;
  articulo: Articulo;
  cantidadActual: number;
  minimo: number;
}

export enum TipoMovimientoStock {
  ENTRADA = "ENTRADA",
  SALIDA = "SALIDA",
}

export interface MovimientoStock {
  id: string;
  fechaMovimiento: string;
  cantidad: number;
  tipoMovimientoStock: TipoMovimientoStock;
  stock: Stock;
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
  detallesSeccionCarta: DetalleSeccionCarta[];
}

export interface DetalleSeccionCarta {
  id: string;
  seccionCartaId: string;
}

export interface DetalleSeccionCartaMenu {
  id: string;
  seccionCartaId: string;
  menu: Menu;
}

export interface DetalleSeccionCartaArticuloIndividual {
  id: string;
  seccionCartaId: string;
  precio: number;
  descripcion?: string;
  articulo: Articulo;
}

export interface Categoria {
  id: string;
  nombre: string;
}
import type { ContactoTelefonico, ContactoCorreoElectronico } from "./contactos";

export interface Empresa {
    id: string;
    nombre: string;
    direccion: Direccion | null;
    contactos: (ContactoTelefonico | ContactoCorreoElectronico)[];
};
