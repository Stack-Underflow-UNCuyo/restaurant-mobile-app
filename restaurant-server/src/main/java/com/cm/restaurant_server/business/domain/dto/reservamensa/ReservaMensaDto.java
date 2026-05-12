package com.cm.restaurant_server.business.domain.dto.reservamensa;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.mesarestaurante.MesaRestauranteDto;
import com.cm.restaurant_server.business.domain.enumeration.EstadoReserva;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReservaMensaDto extends BaseDto {
    private LocalDate fechaReserva;
    private int cantidadAdultos;
    private int cantidadNinos;
    private LocalDateTime horarioReserva;
    private String nombreApellidoCliente;
    private EstadoReserva estadoReserva;
    private MesaRestauranteDto mesaRestaurante;
}
