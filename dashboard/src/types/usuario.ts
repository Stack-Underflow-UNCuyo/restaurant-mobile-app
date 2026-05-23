import { Persona } from "./empleado";

export interface Usuario {
    id: number;
    email: string;
    clave: string;
    rol: string;
    persona: Persona;
    //Imagen: string;
}

export enum Rol {
    ADMIN = 'ADMIN',
    PERSONAL =  'PERSONAL'
}      