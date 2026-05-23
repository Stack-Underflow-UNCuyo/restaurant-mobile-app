package com.cm.restaurant_server.business.domain.dto.persona;

import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCorreoElectronicoDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoTelefonicoDto;
import com.cm.restaurant_server.business.domain.enumeration.TipoDocumento;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

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
    private List<String> contactoCorreoElectronicoIds;
    private List<String> contactoTelefonicoIds;
}
