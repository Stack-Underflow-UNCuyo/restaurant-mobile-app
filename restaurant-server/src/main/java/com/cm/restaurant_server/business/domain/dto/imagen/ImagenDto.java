package com.cm.restaurant_server.business.domain.dto.imagen;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.enumeration.TipoImagen;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ImagenDto extends BaseDto {
    private String nombre;
    private String mime;
    private byte[] contenido;
    private TipoImagen tipoImagen;
}
