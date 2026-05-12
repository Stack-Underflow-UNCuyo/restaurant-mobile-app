package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.EstadoComanda;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_comanda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comanda extends Base {
    private LocalDateTime fechaSolicitudComanda;
    private LocalDateTime fechaEntregaComanda;
    @Enumerated(EnumType.STRING)
    private EstadoComanda estadoComanda;
    @ManyToOne
    private Cliente cliente;
    @ManyToOne
    private ReservaMensa reservaMensa;
}
