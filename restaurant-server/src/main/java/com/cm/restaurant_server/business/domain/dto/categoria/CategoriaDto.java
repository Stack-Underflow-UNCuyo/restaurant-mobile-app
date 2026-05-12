package com.cm.restaurant_server.business.domain.dto.categoria;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoriaDto extends BaseDto {
    private String nombre;
}
