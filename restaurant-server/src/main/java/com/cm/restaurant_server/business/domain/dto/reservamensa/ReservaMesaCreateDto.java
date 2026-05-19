package com.cm.restaurant_server.business.domain.dto.reservamensa;

import com.cm.restaurant_server.business.domain.enumeration.EstadoReserva;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservaMesaCreateDto {
    private LocalDate fechaReserva;
    private int cantidadAdultos;
    private int cantidadNinos;
    private LocalDateTime horarioReserva;
    private String nombreApellidoCliente;
    private EstadoReserva estadoReserva;
    private String mesaRestauranteId;
}
