package com.cm.restaurant_server.business.domain.dto.menu;

import java.util.List;

import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuDto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuCreateDto {
    private String nombre;
    private double precio;
    private List<DetalleMenuDto> detallesMenu;
}
