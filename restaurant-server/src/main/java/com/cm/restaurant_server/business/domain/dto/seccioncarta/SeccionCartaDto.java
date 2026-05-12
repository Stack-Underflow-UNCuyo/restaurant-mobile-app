package com.cm.restaurant_server.business.domain.dto.seccioncarta;

import com.cm.restaurant_server.business.domain.dto.BaseDto;
import com.cm.restaurant_server.business.domain.dto.carta.CartaDto;
import com.cm.restaurant_server.business.domain.dto.categoria.CategoriaDto;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SeccionCartaDto extends BaseDto {
    private CategoriaDto categoria;
    private CartaDto carta;
}
