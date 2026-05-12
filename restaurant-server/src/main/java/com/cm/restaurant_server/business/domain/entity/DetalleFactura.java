package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleFactura extends Base {
    private int cantidad;
    private double subtotal;
    @ManyToOne
    private Factura factura;
    @ManyToOne
    private DetalleComanda detalleComanda;
}
