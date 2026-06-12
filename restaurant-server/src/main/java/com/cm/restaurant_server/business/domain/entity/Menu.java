package com.cm.restaurant_server.business.domain.entity;

import java.util.List;

import org.hibernate.annotations.SQLRestriction;

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
public class Menu extends Base {
    private String nombre;
    private String descripcion;
    private double precio;
    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true)
    @SQLRestriction("eliminado = false")
    private List<DetalleMenu> detallesMenu;
    @ManyToOne
    private Imagen imagen;
}
