export enum TipoPago {
    EFECTIVO = 'EFECTIVO',
    TRANSFERENCIA = 'TRANSFERENCIA',
    BILLETERA_VIRTUAL = 'BILLETERA_VIRTUAL',
}

export interface FormaDePago {
    id: number;
    tipoPago: TipoPago;
    observacion: string;
}