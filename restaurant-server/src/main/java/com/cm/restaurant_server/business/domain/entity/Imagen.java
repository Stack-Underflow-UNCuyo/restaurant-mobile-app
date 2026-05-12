package com.cm.restaurant_server.business.domain.entity;

import com.cm.restaurant_server.business.domain.enumeration.TipoImagen;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

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
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] contenido;
    @Enumerated(EnumType.STRING)
    private TipoImagen tipoImagen;
}
