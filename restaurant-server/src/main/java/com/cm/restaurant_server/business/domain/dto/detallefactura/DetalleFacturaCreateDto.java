package com.cm.restaurant_server.business.domain.dto.detallefactura;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleFacturaCreateDto {
    private int cantidad;
    private double subtotal;
    // La factura se asigna desde la Factura 
    private String detalleComandaId;
}
