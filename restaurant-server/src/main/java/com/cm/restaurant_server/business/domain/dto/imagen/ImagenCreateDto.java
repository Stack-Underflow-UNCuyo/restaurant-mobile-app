package com.cm.restaurant_server.business.domain.dto.imagen;

import com.cm.restaurant_server.business.domain.enumeration.TipoImagen;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImagenCreateDto {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
    @NotBlank(message = "Debe indicar el mime")
    private String mime;
    private byte[] contenido;
    private TipoImagen tipoImagen;
}
