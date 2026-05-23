package com.cm.restaurant_server.business.domain.dto.usuario;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.enumeration.Rol;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UsuarioDto extends BaseDto {
    private String email;
    private String clave;
    private Rol rol;
    private String personaId;
    private String imagenId;

}
