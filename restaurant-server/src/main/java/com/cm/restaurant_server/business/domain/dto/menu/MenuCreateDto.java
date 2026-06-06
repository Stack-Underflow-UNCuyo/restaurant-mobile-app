package com.cm.restaurant_server.business.domain.dto.menu;

import java.util.List;

import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuCreateDto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuCreateDto {
    private String nombre;
    private double precio;
    private List<DetalleMenuCreateDto> detallesMenu;
}
