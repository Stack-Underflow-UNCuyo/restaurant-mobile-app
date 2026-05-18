package com.cm.restaurant_server.business.domain.dto.menu;

import java.util.List;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuDto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MenuDto extends BaseDto {
    private double precio;
    private List<DetalleMenuDto> detallesMenu;
}
