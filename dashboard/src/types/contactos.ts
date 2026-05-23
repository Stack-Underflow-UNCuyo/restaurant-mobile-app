
export enum TipoContacto {
    PERSONAL = 'PERSONAL',
    LABORAL = 'LABORAL',
    EMPRESA = 'EMPRESA'
}

export enum TipoTelefono {
    FIJO = 'FIJO',
    CELULAR = 'CELULAR'
}

export interface Contacto {
    id: string;
    tipoContacto: TipoContacto; 
    observacion: string;
}

export interface ContactoCorreoElectronico extends Contacto {
    email: string;
}

export interface ContactoTelefonico extends Contacto {
    telefono: string;
    tipoTelefono: TipoTelefono;
}