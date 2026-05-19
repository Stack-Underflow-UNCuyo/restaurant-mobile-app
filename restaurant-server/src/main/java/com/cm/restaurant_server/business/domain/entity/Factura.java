package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.EstadoFactura;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Factura extends Base {
    private Long numeroFactura;
    private LocalDate fechaFactura;
    private double totalPagado;
    @Enumerated(EnumType.STRING)
    private EstadoFactura estado;
    @ManyToOne
    private FormaDePago formaDePago;
    @ManyToOne
    private Promocion promocion;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "factura", orphanRemoval = true)
    @SQLRestriction("eliminado = false")
    List<DetalleFactura> detalleFacturas = new ArrayList<>();
}
