package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("RESTAURANT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComandaRestaurant extends Comanda {
    @ManyToOne
    private Empleado empleado;
}
