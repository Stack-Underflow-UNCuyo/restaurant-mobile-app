package com.cm.restaurant_server.business.domain.dto.movimientostock;

import com.cm.restaurant_server.business.domain.enumeration.TipoMovimientoStock;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoStockCreateDto {
    private double cantidad;
    private TipoMovimientoStock tipoMovimientoStock;
    private String stockId;
}
