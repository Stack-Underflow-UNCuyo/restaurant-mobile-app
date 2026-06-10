package com.cm.restaurant_server.business.domain.dto.mercadopago;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Datos para crear una caja (POS) en Mercado Pago, asociada a una sucursal ya
 * creada en nuestro sistema. category y fixedAmount son opcionales (el servicio
 * usa defaults 621102 y false respectivamente).
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CajaCreateDto {
    private String nombre;
    private String externalId;
    /** Id de la Sucursal en nuestra base (no el de Mercado Pago). */
    private String sucursalId;
    private Long category;
    private Boolean fixedAmount;
}
