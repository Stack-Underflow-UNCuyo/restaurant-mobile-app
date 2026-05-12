package com.cm.restaurant_server.business.domain.dto.mesarestaurante;

import com.cm.restaurant_server.business.domain.enumeration.EstadoMesa;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MesaRestauranteCreateDto {
    private int identificadorMesa;
    private EstadoMesa estadoMesa;
    private int capacidadPersonas;
    private String zonaFisica;
}
