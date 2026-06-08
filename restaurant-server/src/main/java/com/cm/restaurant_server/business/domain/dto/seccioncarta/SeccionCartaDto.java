package com.cm.restaurant_server.business.domain.dto.seccioncarta;

import java.util.List;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.categoria.CategoriaDto;
import com.cm.restaurant_server.business.domain.dto.detalleseccioncarta.DetalleSeccionCartaDto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SeccionCartaDto extends BaseDto {
    private String nombre;
    private CategoriaDto categoria;
    private String imagenUrl;
    private String imagenNombre;
    private List<DetalleSeccionCartaDto> detallesSeccionCarta;
}
