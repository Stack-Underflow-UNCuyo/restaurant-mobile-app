package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Email;
import lombok.*;

@Entity
@DiscriminatorValue("CORREO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactoCorreoElectronico extends Contacto {
    @Email(message = "Debe respetar el formato de email")
    private String email;
}
