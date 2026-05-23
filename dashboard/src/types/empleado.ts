import { Contacto, ContactoCorreoElectronico } from "./contactos";
import { Direccion } from "./entities";

export interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    tipoDocumento: string;
    numeroDocumento: string;
    contacto: Contacto
    direccion: Direccion;
    //Imagen: string;
}

export interface Empleado extends Persona {
    tipoEmpleado: TipoEmpleado;
}

export enum TipoEmpleado {
    ADMINISTRATIVO = 'ADMINISTRATIVO',
    COCINERO = 'COCINERO',
    MOZO = 'MOZO'
}