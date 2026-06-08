package com.cm.restaurant_server.business.domain.dto.factura;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LineaFacturaPreviewDto {
    private String detalleComandaId;
    private String nombreItem;
    private int cantidad;
    private double precioUnitario;
    private double subtotal;
}
