package com.cm.restaurant_server.business.domain.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.*;

@Entity
@DiscriminatorValue("ARTICULO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleSeccionCartaArticuloIndividual extends DetalleSeccionCarta {
    private double precio;
    @OneToMany(mappedBy = "detalleSeccionCartaArticuloIndividual", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Articulo> articulos;
}
