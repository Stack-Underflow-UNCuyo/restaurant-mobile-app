package com.cm.restaurant_server.business.domain.dto.articulo;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArticuloCreateDto {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
    private String descripcion;
    private boolean sinTAC;
    private boolean esIngrediente;
    private String unidadDeMedidaId;
}
