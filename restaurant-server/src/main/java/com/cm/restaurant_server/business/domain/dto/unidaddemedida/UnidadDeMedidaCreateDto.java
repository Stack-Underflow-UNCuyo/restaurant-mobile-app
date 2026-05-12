package com.cm.restaurant_server.business.domain.dto.unidaddemedida;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UnidadDeMedidaCreateDto {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
}
