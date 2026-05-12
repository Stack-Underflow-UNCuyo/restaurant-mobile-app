package com.cm.restaurant_server.business.domain.dto.contacto;

import com.cm.restaurant_server.business.domain.enumeration.TipoTelefono;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactoTelefonicoCreateDto extends ContactoCreateDto {
    private String telefono;
    private TipoTelefono tipoTelefono;
}
