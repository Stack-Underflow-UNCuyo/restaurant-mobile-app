package com.cm.restaurant_server.business.domain.dto.detallecomanda;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.enumeration.EstadoDetalleComanda;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetalleComandaDto extends BaseDto {
    private int cantidad;
    private EstadoDetalleComanda estadoDetalleComanda;
    private String comandaId;
    private String detalleSeccionCartaId;
}
