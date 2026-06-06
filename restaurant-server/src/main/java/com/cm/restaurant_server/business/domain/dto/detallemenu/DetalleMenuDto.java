package com.cm.restaurant_server.business.domain.dto.detallemenu;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetalleMenuDto extends BaseDto {
    private String nombre;
    private int cantidad;
    private ArticuloDto articulo;
    private double articuloCantidad;
}
