package com.cm.restaurant_server.business.domain.dto.mercadopago;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Datos para crear una sucursal (store) en Mercado Pago.
 * El externalId lo definimos nosotros 
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SucursalCreateDto {
    private String nombre;
    private String externalId;
    private String streetName;
    private String streetNumber;
    private String cityName;
    private String stateName;
    private Double latitude;
    private Double longitude;
    private String referencia;
}
