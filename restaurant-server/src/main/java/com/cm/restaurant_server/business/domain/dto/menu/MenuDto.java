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
    private String nombre;
    private String descripcion;
    private double precio;
    private String imagenUrl;
    private String imagenNombre;
    private List<DetalleMenuDto> detallesMenu;
}
