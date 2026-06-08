package com.cm.restaurant_server.business.domain.dto.detalleseccioncarta;

import com.cm.restaurant_server.business.domain.dto.imagen.ImagenCreateDto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DetalleSeccionCartaCreateDto {
    private String seccionCartaId;
    private ImagenCreateDto imagen;
}
