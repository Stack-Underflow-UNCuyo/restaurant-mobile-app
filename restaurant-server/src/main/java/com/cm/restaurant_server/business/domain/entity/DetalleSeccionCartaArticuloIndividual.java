package com.cm.restaurant_server.business.domain.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
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
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
        name = "detalle_seccion_carta_articulo",
        joinColumns = @JoinColumn(name = "detalle_id"),
        inverseJoinColumns = @JoinColumn(name = "articulo_id")
    )
    private List<Articulo> articulos;
}
