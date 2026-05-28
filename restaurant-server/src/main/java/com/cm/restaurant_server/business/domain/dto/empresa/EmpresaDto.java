package com.cm.restaurant_server.business.domain.dto.empresa;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.contacto.ContactoDto;
import com.cm.restaurant_server.business.domain.dto.direccion.DireccionDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EmpresaDto extends BaseDto {
    private String nombre;
    private String telefono;
    private String correoElectronico;
    private DireccionDto direccion;
    private ContactoDto[] contactos;
}
