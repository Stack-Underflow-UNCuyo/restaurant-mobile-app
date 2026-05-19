package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.EstadoReserva;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservaMesa extends Base {
    private LocalDate fechaReserva;
    private int cantidadAdultos;
    private int cantidadNinos;
    private LocalDateTime horarioReserva;
    private String nombreApellidoCliente;
    @Enumerated(EnumType.STRING)
    private EstadoReserva estadoReserva;
    @ManyToOne
    private MesaRestaurante mesaRestaurante;
}
