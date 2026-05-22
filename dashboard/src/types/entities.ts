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
  cantidad: number;
  minimo: number;
}

export enum TipoMovimientoStock {
  ENTRADA = "ENTRADA",
  SALIDA = "SALIDA",
}

export interface MovimientoStock {
  id: number;
  fecha: string;
  cantidad: number;
  tipo: TipoMovimientoStock;
  stock: Stock;
}