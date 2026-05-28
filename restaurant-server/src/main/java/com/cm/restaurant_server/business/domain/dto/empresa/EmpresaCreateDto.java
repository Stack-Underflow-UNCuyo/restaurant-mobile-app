package com.cm.restaurant_server.business.domain.dto.empresa;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaCreateDto {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
    private String direccionId;
    private List<String> contactoIds;
}
