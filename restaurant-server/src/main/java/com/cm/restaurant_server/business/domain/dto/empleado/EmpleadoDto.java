package com.cm.restaurant_server.business.domain.dto.empleado;

import com.cm.restaurant_server.business.domain.dto.persona.PersonaDto;
import com.cm.restaurant_server.business.domain.enumeration.TipoEmpleado;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EmpleadoDto extends PersonaDto {
    private TipoEmpleado tipoEmpleado;
}
