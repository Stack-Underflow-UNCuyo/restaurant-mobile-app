package com.cm.restaurant_server.business.domain.dto.factura;

import com.cm.restaurant_server.business.domain.enumeration.TipoPago;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Cobro de una comanda: genera la factura PAGADA con el medio de pago indicado.
 * Usado por el mozo 
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CobrarFacturaDto {
    private String comandaId;
    private TipoPago tipoPago;
    private String promocionId;
}
