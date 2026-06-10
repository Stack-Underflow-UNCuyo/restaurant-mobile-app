package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Sucursal (store) registrada en Mercado Pago. Representa el establecimiento
 * físico al que se asocian una o más cajas. Persistimos lo que devuelve MP para
 * poder referenciar la sucursal sin re-consultar la API.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sucursal extends Base {
    /** Id de la sucursal en Mercado Pago. */
    private Long mpStoreId;
    private String nombre;
    /** Identificador externo que definimos nosotros (ej. "SUC001"). */
    private String externalId;
    private String addressLine;
    private Double latitude;
    private Double longitude;
    private String referencia;
}
