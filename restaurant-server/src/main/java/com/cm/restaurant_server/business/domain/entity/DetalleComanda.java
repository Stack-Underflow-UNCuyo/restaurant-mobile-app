package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.EstadoDetalleComanda;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleComanda extends Base {
    private int cantidad;
    @Enumerated(EnumType.STRING)
    private EstadoDetalleComanda estadoDetalleComanda;
    @ManyToOne
    private Comanda comanda;
    @ManyToOne
    private DetalleSeccionCarta detalleSeccionCarta;
}
