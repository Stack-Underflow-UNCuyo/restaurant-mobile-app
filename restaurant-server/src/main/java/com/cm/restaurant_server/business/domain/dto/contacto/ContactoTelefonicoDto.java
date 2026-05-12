package com.cm.restaurant_server.business.domain.dto.contacto;

import com.cm.restaurant_server.business.domain.enumeration.TipoTelefono;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ContactoTelefonicoDto extends ContactoDto {
    private String telefono;
    private TipoTelefono tipoTelefono;
}
