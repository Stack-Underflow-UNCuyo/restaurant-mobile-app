package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.TipoContacto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Where(clause = "eliminado = false")
public abstract class Contacto extends Base {
    @Enumerated(EnumType.STRING)
    private TipoContacto tipoContacto;
    private String observacion;
}
