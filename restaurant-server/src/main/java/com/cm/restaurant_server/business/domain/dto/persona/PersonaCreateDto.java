package com.cm.restaurant_server.business.domain.dto.persona;

import com.cm.restaurant_server.business.domain.enumeration.TipoDocumento;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PersonaCreateDto {
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private TipoDocumento tipoDocumento;
    private String numeroDocumento;
    private String direccionId;
    private String usuarioId;
}
