package com.cm.restaurant_server.business.domain.dto.comanda;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComandaRestaurantCreateDto extends ComandaCreateDto {
    private String empleadoId;
    private String mesaRestauranteId;
}
