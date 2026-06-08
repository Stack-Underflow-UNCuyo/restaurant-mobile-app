package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_detalle_seccion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleSeccionCarta extends Base {
    @ManyToOne
    private SeccionCarta seccionCarta;
    @ManyToOne
    private Imagen imagen;
}
