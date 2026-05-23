package com.cm.restaurant_server.business.domain.dto.persona;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoCorreoElectronicoDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoTelefonicoDto;
import com.cm.restaurant_server.business.domain.dto.direccion.DireccionDto;
import com.cm.restaurant_server.business.domain.enumeration.TipoDocumento;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

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
    private String direccionId;
    private DireccionDto direccion;
    private List<ContactoCorreoElectronicoDto> contactoCorreoElectronicoDtos;
    private List<String> contactoCorreoElectronicoIds;
    private List<ContactoTelefonicoDto> contactoTelefonicoDtos;
    private List<String> contactoTelefonicoIds;
}
