package com.cm.restaurant_server.business.domain.dto.mercadopago;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Datos para crear una order de cobro por QR (modelo dinámico).
 * cajaExternalId es opcional: si no se envía y hay una sola caja, se usa esa.
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrdenCreateDto {
    /** Monto total a cobrar. */
    private Double amount;
    private String description;
    /** external_id de la caja sobre la que se crea la order (opcional). */
    private String cajaExternalId;
    /** Comanda que se está cobrando (opcional). */
    private String comandaId;
    /** Promoción aplicada (opcional), para la factura al confirmarse el pago. */
    private String promocionId;
    /** Referencia externa única (opcional: si no viene se genera). */
    private String externalReference;
    /** Validez de la order en formato ISO 8601 (opcional, default PT30M). */
    private String expirationTime;
}
