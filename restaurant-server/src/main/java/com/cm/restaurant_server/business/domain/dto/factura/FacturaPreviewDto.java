package com.cm.restaurant_server.business.domain.dto.factura;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacturaPreviewDto {
    private List<LineaFacturaPreviewDto> lineas;
    private double subtotalGeneral;
    private double descuento;
    private double total;
    private boolean yaFacturada;
}
