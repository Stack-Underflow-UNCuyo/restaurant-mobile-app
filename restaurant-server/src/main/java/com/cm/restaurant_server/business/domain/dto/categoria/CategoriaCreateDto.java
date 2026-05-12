package com.cm.restaurant_server.business.domain.dto.categoria;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaCreateDto {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
}
