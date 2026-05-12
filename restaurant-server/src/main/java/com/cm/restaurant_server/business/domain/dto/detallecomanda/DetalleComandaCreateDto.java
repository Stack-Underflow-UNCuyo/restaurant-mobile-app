package com.cm.restaurant_server.business.domain.dto.detallecomanda;

import com.cm.restaurant_server.business.domain.enumeration.EstadoDetalleComanda;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleComandaCreateDto {
    private int cantidad;
    private EstadoDetalleComanda estadoDetalleComanda;
    private String comandaId;
    private String detalleSeccionCartaId;
}
