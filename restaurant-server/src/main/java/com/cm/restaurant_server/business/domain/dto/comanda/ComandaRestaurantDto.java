package com.cm.restaurant_server.business.domain.dto.comanda;

import com.cm.restaurant_server.business.domain.dto.empleado.EmpleadoDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ComandaRestaurantDto extends ComandaDto {
    private EmpleadoDto empleado;
}
