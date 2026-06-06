package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@DiscriminatorValue("ARTICULO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleSeccionCartaArticuloIndividual extends DetalleSeccionCarta {
    private double precio;
    @ManyToOne
    private Articulo articulo;
}
