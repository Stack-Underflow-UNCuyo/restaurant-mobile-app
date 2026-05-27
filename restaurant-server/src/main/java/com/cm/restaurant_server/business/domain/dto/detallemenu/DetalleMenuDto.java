package com.cm.restaurant_server.business.domain.dto.detallemenu;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloDto;
import com.cm.restaurant_server.business.domain.dto.menu.MenuDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetalleMenuDto extends BaseDto {
    private String nombre;
    private int cantidad;
    // @JsonIgnoreProperties("detallesMenu")
    // private MenuDto menu;
    private ArticuloDto articulo;
}
