package com.cm.restaurant_server.business.domain.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
    @OneToMany(mappedBy = "detalleMenu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleMenuArticulo> articulos;

    public Articulo getArticulo() {
        if (articulos == null || articulos.isEmpty()) return null;
        return articulos.get(0).getArticulo();
    }

    public double getArticuloCantidad() {
        if (articulos == null || articulos.isEmpty()) return 0;
        return articulos.get(0).getCantidad();
    }
}
