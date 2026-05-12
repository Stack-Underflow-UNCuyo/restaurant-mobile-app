package com.cm.restaurant_server.business.domain.dto.mesarestaurante;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.enumeration.EstadoMesa;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MesaRestauranteDto extends BaseDto {
    private int identificadorMesa;
    private EstadoMesa estadoMesa;
    private int capacidadPersonas;
    private String zonaFisica;
}
