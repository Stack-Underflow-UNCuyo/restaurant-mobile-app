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
