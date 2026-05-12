package com.cm.restaurant_server.business.domain.dto.detalleseccioncarta;

import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetalleSeccionCartaArticuloIndividualDto extends DetalleSeccionCartaDto {
    private double precio;
    private ArticuloDto articulo;
}
