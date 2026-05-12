package com.cm.restaurant_server.business.domain.dto.empleado;

import com.cm.restaurant_server.business.domain.dto.persona.PersonaCreateDto;
import com.cm.restaurant_server.business.domain.enumeration.TipoEmpleado;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoCreateDto extends PersonaCreateDto {
    private TipoEmpleado tipoEmpleado;
}
