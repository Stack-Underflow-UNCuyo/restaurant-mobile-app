package com.cm.restaurant_server.business.domain.dto.movimientostock;

import com.cm.restaurant_server.business.domain.enumeration.TipoMovimientoStock;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoStockCreateDto {
    private LocalDate fechaMovimiento;
    private double cantidad;
    private TipoMovimientoStock tipoMovimientoStock;
    private String stockId;
}
