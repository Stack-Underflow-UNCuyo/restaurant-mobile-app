export interface Pais {
  id: number;
  nombre: string;
}

export interface Provincia {
  id: number;
  nombre: string;
  pais: Pais;
}

export interface Departamento {
  id: number;
  nombre: string;
  provincia: Provincia;
}

export interface Localidad {
  id: number;
  nombre: string;
  codigoPostal: string;
  departamento: Departamento;
}

export interface Direccion {
  id: number;
  calle: string;
  numeracion: string;
  barrio: string;
  observacion?: string;
  localidad: Localidad;
}

export interface UnidadDeMedida {
  id: number;
  nombre: string;
}

export interface Articulo {
  id: number;
  nombre: string;
  descripcion?: string;
  sinTAC: boolean;
  esIngrediente: boolean;
  unidadDeMedida: UnidadDeMedida;
}

export interface Stock {
  id: number;
  articulo: Articulo;
  cantidadActual: number;
  minimo: number;
}

export enum TipoMovimientoStock {
  ENTRADA = "ENTRADA",
  SALIDA = "SALIDA",
}

export interface MovimientoStock {
  id: number;
  fechaMovimiento: string;
  cantidad: number;
  tipoMovimientoStock: TipoMovimientoStock;
  stock: Stock;
}

export interface DetalleMenu {
  id: number;
  nombre: string;
  cantidad: number;
  articulo: Articulo;
}

export interface Menu {
  id: number;
  nombre: string;
  precio: number;
  detallesMenu: DetalleMenu[];
}

export interface Carta {
  id: number;
  seccionCartaId: string;
  fechaDesde: string;
  fechaHasta: string;
}

export interface SeccionCarta {
  id: number;
  nombre: string;
  categoria: Categoria;
  detallesSeccionCarta: DetalleSeccionCarta[];
}

export interface DetalleSeccionCarta {
  id: number;
  seccionCarta: SeccionCarta;
}

export interface DetalleSeccionCartaMenu {
  id: number;
  seccionCarta: SeccionCarta;
  menu: Menu;
}

export interface DetalleSeccionCartaArticuloIndividual {
  id: number;
  seccionCarta: SeccionCarta;
  precio: number;
  articulos: Articulo[];
}

export interface Categoria {
  id: number;
  nombre: string;
}