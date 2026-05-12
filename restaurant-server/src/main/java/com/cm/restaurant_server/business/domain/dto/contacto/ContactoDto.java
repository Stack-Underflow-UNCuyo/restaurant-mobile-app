package com.cm.restaurant_server.business.domain.dto.contacto;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.enumeration.TipoContacto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ContactoDto extends BaseDto {
    private TipoContacto tipoContacto;
    private String observacion;
    private String personaId;
}
