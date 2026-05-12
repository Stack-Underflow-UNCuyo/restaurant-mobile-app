package com.cm.restaurant_server.business.domain.dto.stock;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StockDto extends BaseDto {
    private double minimo;
    private double cantidadActual;
    private ArticuloDto articulo;
}
