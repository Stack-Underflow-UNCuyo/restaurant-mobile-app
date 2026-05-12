package com.cm.restaurant_server.business.domain.dto.contacto;

import com.cm.restaurant_server.business.domain.enumeration.TipoContacto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactoCreateDto {
    private TipoContacto tipoContacto;
    private String observacion;
    private String personaId;
}
