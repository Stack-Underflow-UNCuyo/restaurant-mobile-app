package com.cm.restaurant_server.business.domain.dto.usuario;

import com.cm.restaurant_server.business.domain.enumeration.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UsuarioCreateDto {
    @Email(message="Debe respetar formato")
    private String email;
    @NotBlank(message = "El campo no puede ser vacio.")
    private String clave;
    private Rol rol;
    private String personaId;
    private String imagenId;
}
