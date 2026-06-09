package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
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
public class Resenia extends Base {
    private String observacion;
    private String fechaResenia;
    @ManyToOne
    @JoinColumn(name = "comanda_id")
    private Comanda comanda;
    private Integer ambiente;
    private Integer servicio;
    private Integer comida;
}
