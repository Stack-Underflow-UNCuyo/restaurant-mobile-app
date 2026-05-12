package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.TipoTelefono;
import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("TELEFONICO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactoTelefonico extends Contacto {
    private String telefono;
    @Enumerated(EnumType.STRING)
    private TipoTelefono tipoTelefono;
}
