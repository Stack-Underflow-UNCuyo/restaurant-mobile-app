package com.cm.restaurant_server.business.domain.dto.promocion;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PromocionDto extends BaseDto {
    private double porcentajeDescuento;
    private String descripcion;
}
