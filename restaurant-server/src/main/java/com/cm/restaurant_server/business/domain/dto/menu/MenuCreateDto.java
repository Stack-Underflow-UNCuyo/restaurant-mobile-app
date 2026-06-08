package com.cm.restaurant_server.business.domain.dto.menu;

import java.util.List;

import com.cm.restaurant_server.business.domain.dto.detallemenu.DetalleMenuCreateDto;
import com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuCreateDto {
    private String nombre;
    private String descripcion;
    private double precio;
    private List<DetalleMenuCreateDto> detallesMenu;
    private ImagenCreateDto imagen;
}
