package com.cm.restaurant_server.business.domain.dto.movimientostock;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.stock.StockDto;
import com.cm.restaurant_server.business.domain.enumeration.TipoMovimientoStock;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MovimientoStockDto extends BaseDto {
    private LocalDate fechaMovimiento;
    private double cantidad;
    private TipoMovimientoStock tipoMovimientoStock;
    private StockDto stock;
}
