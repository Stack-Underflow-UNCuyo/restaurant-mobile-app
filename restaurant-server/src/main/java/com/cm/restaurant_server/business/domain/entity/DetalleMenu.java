package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleMenu extends Base {
    private String nombre;
    private int cantidad;
    @ManyToOne
    private Menu menu;
    @ManyToOne
    private Articulo articulo;
    private double articuloCantidad;
}
