package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.TipoImagen;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Imagen extends Base {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
    @NotBlank(message = "Debe indicar el mime")
    private String mime;
    private String url;
    @Enumerated(EnumType.STRING)
    private TipoImagen tipoImagen;
}
