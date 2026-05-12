package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.TipoMovimientoStock;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoStock extends Base {
    private LocalDate fechaMovimiento;
    private double cantidad;
    @Enumerated(EnumType.STRING)
    private TipoMovimientoStock tipoMovimientoStock;
    @ManyToOne
    private Stock stock;
}
