package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Caja (POS / punto de venta) de Mercado Pago, asociada a una {@link Sucursal}.
 * Guardamos su QR porque el mozo lo muestra al cliente para cobrar, y su
 * externalId/posId porque las Orders los necesita para generar el cobro.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Caja extends Base {
    /** Id de la caja (POS) en Mercado Pago. */
    private Long mpPosId;
    private String nombre;
    /** Identificador externo que definimos nosotros  */
    private String externalId;
    /** External id de la sucursal a la que pertenece (en Mercado Pago). */
    private String externalStoreId;
    /** Rubro / MCC de la caja  */
    private Long category;
    private Boolean fixedAmount;
    private String status;
    private String uuid;
    /** URL de la imagen PNG del QR a mostrar para cobrar. */
    private String qrImage;
    private String qrTemplateDocument;
    private String qrTemplateImage;

    @ManyToOne
    private Sucursal sucursal;
}
