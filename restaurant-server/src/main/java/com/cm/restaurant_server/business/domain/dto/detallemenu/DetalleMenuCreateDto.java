package com.cm.restaurant_server.business.domain.dto.detallemenu;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleMenuCreateDto {
    private String nombre;
    private int cantidad;
    private String menuId;
    private String articuloId;
    private double articuloCantidad;
}
