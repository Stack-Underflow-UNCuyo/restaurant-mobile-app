package com.cm.restaurant_server.business.domain.dto.detalleseccioncarta;

import java.util.List;

import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloDto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleSeccionCartaArticuloIndividualCreateDto extends DetalleSeccionCartaCreateDto {
    private double precio;
    private List<ArticuloDto> articulos;
}
