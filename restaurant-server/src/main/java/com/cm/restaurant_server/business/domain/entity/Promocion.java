package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Promocion extends Base {
    @DecimalMin(value = "0.0", message = "El porcentaje no puede ser negativo")
    @DecimalMax(value = "100.0", message = "El porcentaje no puede superar 100")
    private double porcentajeDescuento;
    private String descripcion;
}
