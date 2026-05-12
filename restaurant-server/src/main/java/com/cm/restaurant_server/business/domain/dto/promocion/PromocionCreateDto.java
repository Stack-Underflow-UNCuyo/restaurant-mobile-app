package com.cm.restaurant_server.business.domain.dto.promocion;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromocionCreateDto {
    private double porcentajeDescuento;
    private String descripcion;
}
