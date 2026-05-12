package com.cm.restaurant_server.business.domain.dto.contacto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ContactoCorreoElectronicoDto extends ContactoDto {
    private String email;
}
