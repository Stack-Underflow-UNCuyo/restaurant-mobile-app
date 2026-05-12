package com.cm.restaurant_server.business.domain.dto.stock;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockCreateDto {
    private double minimo;
    private double cantidadActual;
    private String articuloId;
}
