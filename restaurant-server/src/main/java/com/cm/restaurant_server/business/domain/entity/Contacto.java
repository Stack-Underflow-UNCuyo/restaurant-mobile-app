package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.TipoContacto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_contacto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contacto extends Base {
    @Enumerated(EnumType.STRING)
    private TipoContacto tipoContacto;
    private String observacion;
    @ManyToOne
    private Persona persona;
}
