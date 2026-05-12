package com.cm.restaurant_server.business.domain.dto.detalleseccioncarta;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleSeccionCartaArticuloIndividualCreateDto extends DetalleSeccionCartaCreateDto {
    private double precio;
    private String articuloId;
}
