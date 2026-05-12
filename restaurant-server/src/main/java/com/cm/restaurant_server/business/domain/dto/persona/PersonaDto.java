package com.cm.restaurant_server.business.domain.dto.persona;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.direccion.DireccionDto;
import com.cm.restaurant_server.business.domain.dto.usuario.UsuarioDto;
import com.cm.restaurant_server.business.domain.enumeration.TipoDocumento;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PersonaDto extends BaseDto {
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private TipoDocumento tipoDocumento;
    private String numeroDocumento;
    private DireccionDto direccion;
    private UsuarioDto usuario;
}
