package com.cm.restaurant_server.business.domain.dto.comanda;

import com.cm.restaurant_server.business.domain.enumeration.EstadoComanda;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComandaCreateDto {
    private LocalDateTime fechaSolicitudComanda;
    private LocalDateTime fechaEntregaComanda;
    private EstadoComanda estadoComanda;
    private String clienteId;
    private String reservaMensaId;
}
