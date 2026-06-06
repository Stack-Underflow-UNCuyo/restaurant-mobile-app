package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleMenuArticulo extends Base {
    private double cantidad;

    @ManyToOne
    private DetalleMenu detalleMenu;

    @ManyToOne
    private Articulo articulo;
}
