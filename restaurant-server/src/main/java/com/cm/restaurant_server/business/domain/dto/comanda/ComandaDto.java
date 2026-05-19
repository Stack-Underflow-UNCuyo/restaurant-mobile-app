package com.cm.restaurant_server.business.domain.dto.comanda;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.enumeration.EstadoComanda;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ComandaDto extends BaseDto {
    private LocalDateTime fechaSolicitudComanda;
    private LocalDateTime fechaEntregaComanda;
    private EstadoComanda estadoComanda;
    private String clienteId;
    private String reservaMesaId;
}
