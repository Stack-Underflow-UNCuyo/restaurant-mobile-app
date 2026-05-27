package com.cm.restaurant_server.business.domain.dto.detallemenu;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleMenuCreateDto {
    private String nombre;
    private int cantidad;
    // private String menuId;
    private String articuloId;
}
