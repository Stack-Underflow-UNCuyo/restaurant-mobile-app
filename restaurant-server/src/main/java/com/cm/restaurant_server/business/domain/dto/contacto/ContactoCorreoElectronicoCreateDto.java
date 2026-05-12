package com.cm.restaurant_server.business.domain.dto.contacto;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactoCorreoElectronicoCreateDto extends ContactoCreateDto {
    @Email(message = "Debe respetar el formato de email")
    private String email;
}
