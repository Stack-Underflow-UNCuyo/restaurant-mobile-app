export interface Usuario {
    id: string;
    email: string;
    clave: string;
    rol: string;
    personaId: string | null;
    imagenId?: string | null;
}

export enum Rol {
    ADMIN = 'ADMIN',
    PERSONAL =  'PERSONAL'
}
