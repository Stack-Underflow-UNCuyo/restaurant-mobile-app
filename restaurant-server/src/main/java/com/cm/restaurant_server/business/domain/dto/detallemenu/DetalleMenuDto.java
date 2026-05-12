package com.cm.restaurant_server.business.domain.dto.detallemenu;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.articulo.ArticuloDto;
import com.cm.restaurant_server.business.domain.dto.menu.MenuDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetalleMenuDto extends BaseDto {
    private int cantidad;
    private MenuDto menu;
    private ArticuloDto articulo;
}
