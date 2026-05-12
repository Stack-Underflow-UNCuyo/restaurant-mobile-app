package com.cm.restaurant_server.business.domain.dto.empresa;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaCreateDto {
    @NotBlank(message = "Debe indicar el nombre")
    private String nombre;
    private String telefono;
    private String correoElectronico;
    private String direccionId;
    private String contactoId;
}
